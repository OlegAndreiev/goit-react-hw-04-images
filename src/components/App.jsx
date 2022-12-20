import React, { useState } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import css from '../components/Modal/Modal.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

export default function App() {
  const [searchedName, setSearchedName] = useState(() => '');
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);
  const [noNewData, setNoNewData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [id, setId] = useState('');
  const [activeImgIdx, setActiveImgIdx] = useState(null);
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '30800366-aecfdce11bab1e79da5c222a8';

  const reset = () => {
    setData(null);
    setNoData(false);
    setNoNewData(false);
  };

  const formSubmitHandler = searchedName => {
    reset();
    setSearchedName(searchedName);
  };

  const changePagePagination = () => {
    setPage(page + 1);
  };

  const responceDataInput = responce => {
    if (responce.total < 12 && responce.total > 0) {
      setNoNewData(true);
    }
    if (responce.total === 0) {
      setNoData(true);
    }
    if (responce.total) {
      setData(responce.hits);
      setNoData(false);
    }
  };

  const paginationDataInput = responce => {
    setData(prevData => [...prevData, ...responce.hits]);
    if (responce.total < 12) {
      setNoNewData(true);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const setCurrentImgIdx = idx => {
    console.log(idx);
    setActiveImgIdx(idx);
  };

  useEffect(() => {
    if (searchedName !== '') {
      setLoading(true);
      fetch(
        `${BASE_URL}?q=${searchedName}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then(responce => {
          if (responce.ok) {
            return responce.json();
          }
  
          return Promise.reject(new Error('Something has gone wrong!'));
        })
        .catch(error => setError({ error }))
        .then(data => responceDataInput(data))
        .finally(() => setLoading(false));
    }
    
  }, [searchedName]);

  useEffect(() => {
    if (searchedName !== '') {
      setLoading(true);
      fetch(
        `${BASE_URL}?q=${searchedName}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then(responce => {
          if (responce.ok) {
            return responce.json();
          }
          return Promise.reject(new Error('Something has gone wrong!'));
        })
        .catch(error => setError({ error }))
        .then(data => paginationDataInput(data))
        .finally(() => setLoading(false));
    }
   
  }, [page]);

  return (
    <>
      <Searchbar onSubmit={formSubmitHandler} />

      <ImageGallery
        searchedName={searchedName}
        data={data}
        error={error}
        showModal={toggleModal}
        activeIdx={setCurrentImgIdx}
      />
      {noData && (
        <div style={{ fontSize: 24 }}>
          Sorry, no results were found for your request...
        </div>
      )}
      {loading && <Loader />}
      {data && !loading && !noNewData && (
        <Button onClick={changePagePagination} />
      )}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img
            src={data[activeImgIdx].largeImageURL}
            alt={data[activeImgIdx].tags}
            className={css.Modal}
          ></img>
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </>
  );
}

// class App extends React.Component {
//   state = {
//     searchedName: '',
//     data: null,
//     page: 1,
//     loading: false,
//     error: null,
//     noData: false,
//     noNewData: false,
//     showModal: false,
//     id: '',
//     activeImgIdx: null,
//   };
//   reset = () => {
//     this.setState({ data: null, noData: false, noNewData: false });
//   };

//   formSubmitHandler = searchedName => {
//     this.reset();
//     this.setState({ searchedName });
//   };

//   changePagePagination = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };

//   responceDataInput = responce => {
//     if (responce.total < 12 && responce.total > 0) {
//       this.setState({
//         noNewData: true,
//       });
//     }
//     if (responce.total === 0) {
//       this.setState({
//         noData: true,
//       });
//     }
//     if (responce.total) {
//       this.setState({
//         data: responce.hits,
//         noData: false,
//       });
//     }
//   };

//   paginationDataInput = responce => {
//     this.setState(prevState => ({
//       data: [...prevState.data, ...responce.hits],
//     }));
//     if (responce.total < 12) {
//       this.setState({
//         noNewData: true,
//       });
//     }
//   };

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//   };

//   setActiveImgIdx = idx => {
//     this.setState({ activeImgIdx: idx });
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const BASE_URL = 'https://pixabay.com/api/';
//     const API_KEY = '30800366-aecfdce11bab1e79da5c222a8';
//     const prevName = prevState.searchedName;
//     const newName = this.state.searchedName;
//     const currentPage = this.state.page;
//     const prevPage = prevState.page;
//     const newPage = this.state.page;

//     if (prevName !== newName) {
//       this.setState({ loading: true });
//       fetch(
//         `${BASE_URL}?q=${newName}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
//       )
//         .then(responce => {
//           if (responce.ok) {
//             return responce.json();
//           }

//           return Promise.reject(new Error('Something has gone wrong!'));
//         })
//         .catch(error => this.setState({ error }))
//         .then(data => this.responceDataInput(data))
//         .finally(() => this.setState({ loading: false }));
//     }
//     if (prevPage !== newPage) {
//       this.setState({ loading: true });
//       fetch(
//         `${BASE_URL}?q=${newName}&page=${currentPage}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
//       )
//         .then(responce => {
//           if (responce.ok) {
//             return responce.json();
//           }
//           return Promise.reject(new Error('Something has gone wrong!'));
//         })
//         .catch(error => this.setState({ error }))
//         .then(data => this.paginationDataInput(data))
//         .finally(() => this.setState({ loading: false }));
//     }
//   }

//   render() {
//     const {
//       searchedName,
//       showModal,
//       data,
//       loading,
//       noData,
//       noNewData,
//       error,
//       activeImgIdx,
//     } = this.state;
//     return (
//       <>
//         <Searchbar onSubmit={this.formSubmitHandler} />

//         <ImageGallery
//           searchedName={searchedName}
//           data={data}
//           error={error}
//           showModal={this.toggleModal}
//           activeIdx={this.setActiveImgIdx}
//         />
//         {noData && (
//           <div style={{ fontSize: 24 }}>
//             Sorry, no results were found for your request...
//           </div>
//         )}
//         {loading && <Loader />}
//         {data && !loading && !noNewData && (
//           <Button onClick={this.changePagePagination} />
//         )}
//         {showModal && (
//           <Modal onClose={this.toggleModal}>
//             <img
//               src={data[activeImgIdx].largeImageURL}
//               alt={data[activeImgIdx].tags}
//               className={css.Modal}
//             ></img>
//           </Modal>
//         )}
//         <ToastContainer autoClose={3000} />
//       </>
//     );
//   }
// }

// export default App;
