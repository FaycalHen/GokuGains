import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { addNotification } from "../../redux/userRedux";
import { userRequest } from "../../requestMethods";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { useDispatch } from "react-redux";

const Product = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const location = useLocation();
    const dispatch = useDispatch();
    const productId = location.pathname.split("/")[2];
    const [pStats, setPStats] = useState([]);
    const [product, setProduct] = useState({});
    const [file, setFile] = useState(null);
    const [cat, setCat] = useState(""); // Change to a string to hold comma-separated values
    const [formValues, setFormValues] = useState({
        title: "",
        desc: "",
        price: "",
        inStock: "",
        in_Stock: "true",
        categories: [],
    });

    const handleCat = (e) => {
        const { value } = e.target;
        setCat(value); // Update cat with the input value
        setFormValues((prevValues) => ({ ...prevValues, categories: value.split(",") })); // Update categories directly in formValues
    };

    const MONTHS = useMemo(
        () => [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        []
    );

    const getProduct = async () => {
        try {
            const res = await userRequest.get(`http://localhost:5000/api/products/find/${productId}`, {
                headers: { token: `Bearer ${currentUser.accessToken}` },
            });

            setProduct(res.data);
            console.log("res", res.data);
            setFormValues({
                title: res.data.title || "",
                desc: res.data.desc || "",
                price: res.data.price || "",
                inStock: res.data.inStock || "",
                in_Stock: res.data.in_Stock ? "true" : "false",
                categories: res.data.categories.join(", ") || "" // Ensure categories are in comma-separated string format
            });
            setCat(res.data.categories.join(", ") || ""); // Update cat with the current product categories
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getProduct();
    }, [productId]);

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await userRequest.get("http://localhost:5000/api/orders/income?pid=" + productId, {
                    headers: { token: `Bearer ${currentUser.accessToken}` },
                });
                const list = res.data.sort((a, b) => a._id - b._id);
                list.map((item) =>
                    setPStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], Sales: item.total },
                    ])
                );
            } catch (err) {
                console.log(err);
            }
        };

        getStats();
    }, [productId, MONTHS]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        let updatedProduct = {
            ...formValues,
            in_Stock: formValues.in_Stock === "true",
            categories: cat.split(",").map((c) => c.trim()), // Ensure categories are trimmed and formatted correctly
        };
        console.log("updated prod", updatedProduct);

        if (file) {
            const fileName = new Date().getTime() + file.name;
            const storage = getStorage(app);
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    console.error("Failed to upload file:", error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedProduct = { ...updatedProduct, img: downloadURL };
                        await updateProduct(updatedProduct);
                        await getProduct(); // Fetch updated product details
                    } catch (error) {
                        console.error("Failed to get download URL:", error);
                    }
                }
            );
        } else {
            await updateProduct(updatedProduct);
            await getProduct(); // Fetch updated product details
        }
    };

    const updateProduct = async (updatedProduct) => {
        console.log("Updating product with data:", updatedProduct);
        try {
            const response = await userRequest.put(`http://localhost:5000/api/products/${productId}`, updatedProduct, {
                headers: { token: `Bearer ${currentUser.accessToken}` },
            });
            console.log("Update response:", response.data);
            dispatch(addNotification({ message: `Product ${product.title} is updated !!`, type: "success" }));
        } catch (err) {
            console.error("Failed to update product:", err);
            dispatch(addNotification({ message: `Couldn't update Product ${product.title} !!`, type: "error" }));
        }
    };

    return (
        <div className="product">
            <div className="productTitleContainer">
                <h1 className="productTitle">Product</h1>
                <Link to="/newproduct">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopLeft">
                    <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
                </div>
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <img src={product.img || "https://via.placeholder.com/150"} alt="" className="productInfoImg" />
                        <span className="productName">{product.title}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">id:</span>
                            <span className="productInfoValue">{product._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">sales:</span>
                            <span className="productInfoValue">5123</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">in stock:</span>
                            <span className="productInfoValue">{product.inStock}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">availability:</span>
                            <span className="productInfoValue">{product.in_Stock ? "Yes" : "No"}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm" onSubmit={handleFormSubmit}>
                    <div className="productFormLeft">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="title"
                            value={formValues.title}
                            onChange={handleInputChange}
                            placeholder={product.title}
                        />
                        <label>Product Description</label>
                        <input
                            type="text"
                            name="desc"
                            value={formValues.desc}
                            onChange={handleInputChange}
                            placeholder={product.desc}
                        />
                        <label>Product Category</label>
                        <input
                            type="text"
                            name="categories"
                            value={cat} // Use cat state here for input
                            onChange={handleCat}  
                            placeholder={product.categories || "Enter categories"}
                        />
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formValues.price}
                            onChange={handleInputChange}
                            placeholder={product.price}
                        />
                        <label>In Stock (Quantity)</label>
                        <input
                            type="number"
                            name="inStock"
                            value={formValues.inStock}
                            onChange={handleInputChange}
                            placeholder={product.inStock}
                        />
                        <label>Availability</label>
                        <select
                            name="in_Stock"
                            id="idStock"
                            value={formValues.in_Stock}
                            onChange={handleInputChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src={product.img || "https://via.placeholder.com/150"} alt="" className="productUploadImg" />
                            <label htmlFor="file">
                                <Publish />
                            </label>
                            <input
                                type="file"
                                id="file"
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <button className="productButton" type="submit">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Product;
