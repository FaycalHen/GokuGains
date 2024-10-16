import { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PaginationButton = styled.button`
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ddd;
  &:hover {
    background-color: #f5f5f5;
  }
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const Products = ({ cat, filters, sort, currentPage, setCurrentPage, productsPerPage }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("cat",cat)
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products?category=${cat}`
            : "http://localhost:5000/api/products"
        );
        setProducts(res.data);
        console.log("res",res.data)
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    // Apply filters based on the filters provided (e.g., rating)
    setFilteredProducts(
      products.filter((item) => {
        if (!filters || Object.keys(filters).length === 0 ||filters.rating === "all") return true;
        if (filters.rating === "0") {
          return item.averageRating === 0; // Show products with a rating of 0
        }

        if (filters.rating) {
          return item.averageRating >= Number(filters.rating); // Show products with ratings >= selected rating
        }

        return true; // If no filter, return all products
      })
    );
  }, [products, filters]);

  useEffect(() => {
    // Sorting logic
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Container>
        {currentProducts.length > 0 ? (
          currentProducts.map((item) => <Product item={item} key={item.id} />)
        ) : (
          <div>No products found.</div>
        )}
      </Container>

      {/* Pagination Controls */}
      <PaginationWrapper>
        <PaginationButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </PaginationButton>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <PaginationButton
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            disabled={currentPage === pageNumber}
          >
            {pageNumber}
          </PaginationButton>
        ))}
        <PaginationButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </PaginationWrapper>
    </>
  );
};

export default Products;
