// dsaFunctions.js

// Trie Node Class
class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
      this.books = []; // Store book references
    }
  }
  
  // Trie Data Structure for Efficient Search
  class BookTrie {
    constructor() {
      this.root = new TrieNode();
    }
  
    // Insert book into Trie
    insert(book) {
      let node = this.root;
      for (let char of book.name.toLowerCase()) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
        node.books.push(book); // Store book reference
      }
      node.isEndOfWord = true;
    }
  
    // Search for books based on prefix
    search(prefix) {
      let node = this.root;
      for (let char of prefix.toLowerCase()) {
        if (!node.children[char]) return [];
        node = node.children[char];
      }
      return node.books; // Return books matching the prefix
    }
  }
  
  // Sorting Algorithm (QuickSort for performance)
  const quickSortBooks = (books, key) => {
    if (books.length <= 1) return books;
    const pivot = books[books.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < books.length - 1; i++) {
      if (books[i][key] < pivot[key]) left.push(books[i]);
      else right.push(books[i]);
    }
    return [...quickSortBooks(left, key), pivot, ...quickSortBooks(right, key)];
  };
  
  // Two-pointer technique for filtering books based on price range
  const filterBooksByPrice = (books, minPrice, maxPrice) => {
    books.sort((a, b) => a.price - b.price); // Ensure sorted order
    let left = 0, right = books.length - 1;
    while (left <= right && books[left].price < minPrice) left++;
    while (right >= left && books[right].price > maxPrice) right--;
    return books.slice(left, right + 1);
  };
  
  export { BookTrie, quickSortBooks, filterBooksByPrice };
  