import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooksByCategory, fetchCategories } from "../redux/bookSlice";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, categories, searchQuery } = useSelector((state) => state.books);
  const cartItems = useSelector((state) => state.cart.items);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("price");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
    setAllBooks([]);
  }, [selectedCategory]);

  useEffect(() => {
    dispatch(fetchBooksByCategory({ category: selectedCategory, page })).then((res) => {
      const fetchedBooks = res.payload.products || [];
      setHasMore(fetchedBooks.length >= 10);
      setAllBooks((prevBooks) => (page === 1 ? fetchedBooks : [...prevBooks, ...fetchedBooks]));
    });
  }, [selectedCategory, page, dispatch]);

  const filteredBooks = allBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.name.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );
  });

  const shouldShowLoadMore = !searchQuery && hasMore;

  const handleSort = (criteria) => {
    setSortOption(criteria);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Categories Section */}
      <div className="my-6 flex space-x-4 overflow-x-auto scrollbar-hide p-2">
        <button
          onClick={() => {
            setSelectedCategory("");
            setPage(1);
          }}
          className={`px-5 py-2 rounded-lg text-center shadow-md transition-all duration-300 ${
            selectedCategory === "" ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => {
              setSelectedCategory(category.name);
              setPage(1);
            }}
            className={`flex flex-col items-center min-w-[120px] text-center p-3 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
              selectedCategory === category.name ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <img
              src={category.imageUrl || "https://via.placeholder.com/50"}
              alt={category.name}
              className="h-12 w-12 object-cover rounded-full border border-gray-300"
            />
            <span className="mt-2">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Sorting Buttons */}
      <div className="flex justify-center space-x-3 mb-6">
        <button
          onClick={() => handleSort("price")}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
            sortOption === "price"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Sort by Price
        </button>
        <button
          onClick={() => handleSort("rating")}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
            sortOption === "rating"
              ? "bg-gradient-to-r from-green-500 to-teal-600 shadow-lg"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Sort by Rating
        </button>
        <button
          onClick={() => handleSort("discount")}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
            sortOption === "discount"
              ? "bg-gradient-to-r from-red-500 to-orange-600 shadow-lg"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Sort by Discount
        </button>
      </div>

      {/* Books Display */}
      {loading && page === 1 ? (
        <p className="text-center text-lg text-blue-600">Loading books...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
          {[...filteredBooks]
            .sort((a, b) => {
              if (sortOption === "price") return a.price - b.price;
              if (sortOption === "rating") return b.rating - a.rating;
              if (sortOption === "discount") return b.discount - a.discount;
              return 0;
            })
            .map((book) => {
              const discountedPrice = book.price - (book.price * book.discount) / 100;
              return (
                <div
                  key={book._id}
                  className="border rounded-lg p-4 shadow-lg bg-white transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col h-full relative"
                >
                  {book.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {book.discount}% OFF
                    </div>
                  )}

                  <Link to={`/product/${book._id}`}>
                    <img
                      src={book.imageUrl}
                      alt={book.name}
                      className="h-64 w-full object-cover rounded-md border border-gray-200"
                    />
                    <h3 className="mt-3 text-lg font-semibold text-gray-800">{book.name}</h3>
                    <p className="text-gray-500">{book.category}</p>

                    {book.discount > 0 ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-red-500 font-bold">₹{discountedPrice.toFixed(2)}</p>
                        <p className="text-gray-500 line-through">₹{book.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-green-600 font-bold mt-1">₹{book.price.toFixed(2)}</p>
                    )}

                    <p className="text-yellow-500">⭐ {book.rating}</p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{book.description}</p>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="mt-auto">
                    {cartItems[book._id] ? (
                      <button
                        className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300 shadow-md"
                        onClick={() => dispatch(addToCart(book))}
                      >
                        Added ({cartItems[book._id].quantity})
                      </button>
                    ) : (
                      <button
                        className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md"
                        onClick={() => dispatch(addToCart(book))}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

         
        </div>
      )} 
       {/* Load More Button */}
          {shouldShowLoadMore && !loading && (
            <div className="flex justify-center  mt-6">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-5 py-2 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Load More
              </button>
            </div>
          )}
    </div>
  );
};

export default Home;
