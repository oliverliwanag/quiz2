import React from "react";
import { useState, useEffect} from "react";
import './booksearch.css';

const BookSearch = () => {
  const [query, setQuery] = useState('top books');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const booksPerPage = 20;

  useEffect(() => {
    if (query) {
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${
          page * booksPerPage
        }&maxResults=${booksPerPage}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBooks(data.items || []);
          setTotalItems(data.totalItems || 0);
        });
    }
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setQuery(e.target.search.value);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        console.log('File content:', content);
      };
      reader.readAsText(uploadedFile);
    }
  };

  return (
    <div className="booksearchcontainer ">
      <div className="bookcontainer">
        <div className="header">
            <h1 className="title">Book Finder</h1>
        </div>

        <form onSubmit={handleSearch} className="searchbar">
            <input type="text" name="search" placeholder="Search for books..." />
            <div className="buttons">
                <button type="submit">Search</button>

                <button type="button" className="uploadbutton" onClick={() => document.getElementById('fileupload').click()}>
                    Upload
                </button>

            <input
                type="file"
                id="fileupload"
                className="hiddenfileinput"
                onChange={handleFileUpload}
            />
            </div>
        </form>

        <div className="bookslist">
          {books.map((book) => (
            <div className="bookcard" key={book.id}>
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="bookthumbnail"
                />
              ) : (
                <div className="noimage">No Image</div>
              )}
              <div className="bookinfo">
                <h3>{book.volumeInfo.title}</h3>
                <p>{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {books.length > 0 && (
        <div className="paginationcontrols">
          <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            Previous
          </button>
          <span>Page {page + 1}</span>
          <button
            onClick={() =>
              setPage((p) => (p + 1) * booksPerPage < totalItems ? p + 1 : p)
            }
            disabled={(page + 1) * booksPerPage >= totalItems}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookSearch;