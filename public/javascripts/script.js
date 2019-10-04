window.onload = () => {

  console.log('Yo!');
  
  let baseUrl = 'https://library-project-05.herokuapp.com';
  let uri = window.location.pathname;

  // plot book location on map - book details page
  const placeBook = book => {
    if (book.location) {
      const bookPosition = {
        lat: book.location.coordinates[1],
        lng: book.location.coordinates[0]
      };

      const map = new google.maps.Map(
        document.getElementById('map'),
        {
          zoom: 14,
          center: bookPosition
        }
      );

      const pin = new google.maps.Marker({
        position: bookPosition,
        map: map,
        title: book.title
      });

    }

  };

  const getBooks = () => {
    axios.get(`${baseUrl}/api`)
      .then(booksFromDb => {
        placeBooks(booksFromDb.data)
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getBookById = bookId => {
    axios.get(`${baseUrl}/api/book/${bookId}`)
      .then(bookFromDb => {
        placeBook(bookFromDb.data);
      })
      .catch(err => {
        console.log(err);
      });
  };


  const placeBooks = (books) => {
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 12,
        center: {
          lat: -23.5431786,
          lng: -46.6291845
        }
      }
    );
    books.forEach((book) => {
      if (book.location) {
        const center = {
          lat: book.location.coordinates[1],
          lng: book.location.coordinates[0]
        };
        const pin = new google.maps.Marker({
          position: center,
          map: map,
          title: book.name
        });
      }
    });

  }


  // checking if we're on homepage or book detail's page
  if (uri.length > 1) {
    let bookId = uri.split('/')[2];
    getBookById(bookId);
  } else {
    getBooks();
  }

};