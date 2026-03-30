import { useState, useEffect } from 'react';
import './App.css';

interface Book {
  id: number;
  title: string;
  isbn: string;
  authors: string[];
  cover?: string;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://openlibrary.org/search.json?q=russian')
      .then(res => res.json())
      .then(data => {
        const books = data.docs.slice(0, 67).map((book: any) => ({
          id: book.key,
          title: book.title,
          authors: book.author_name?.[0] || 'Неизвестный автор',
          cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : ''
        }));
        setBooks(books);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка API:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <h1>Библиотека</h1>
      {loading && <div>Загрузка...</div>}
      <div className="books-grid">
        {books.map((book) => (
          <div className="book-card">
            {book.cover && <img className="book-cover" src={book.cover} alt={book.title} />}
            <div className="book-info">
              <h2>{book.title}</h2>
              <p>{book.authors}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;