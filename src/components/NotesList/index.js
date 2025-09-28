import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingView from '../LoadingView';
import FailureView from '../FailureView';
import './index.css';

const API_URL = process.env.REACT_APP_BACKEND_API;
const ITEMS_PER_PAGE = 5;

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const NotesList = () => {
  const [flexys, setFlexys] = useState([]);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingId, setDeletingId] = useState(null); // New state for tracking deletion

  useEffect(() => {
    const fetchFlexys = async () => {
      setStatus(STATUS.LOADING);
      try {
        const response = await axios.get(`${API_URL}/hoardings`, {
          params: {
            search: searchTerm,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
        });
        const responseData = response.data.data; 
        setFlexys(responseData.data || []);
        setTotalPages(Math.ceil(responseData.total / ITEMS_PER_PAGE));
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch flexys:", error);
        setStatus(STATUS.FAILURE);
      }
    };
    
    const timerId = setTimeout(() => {
      fetchFlexys();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hoarding? This action cannot be undone.')) {
      setDeletingId(id); // Set the ID of the item being deleted
      try {
        await axios.delete(`${API_URL}/hoardings/${id}`);
        // Refetch after delete to ensure data consistency
        const response = await axios.get(`${API_URL}/hoardings`, {
            params: { search: searchTerm, page: currentPage, limit: ITEMS_PER_PAGE },
        });
        const responseData = response.data.data;
        setFlexys(responseData.data || []);
        setTotalPages(Math.ceil(responseData.total / ITEMS_PER_PAGE));
        // Go to previous page if the last item on a page was deleted
        if (responseData.data.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Failed to delete hoarding:", error);
        alert("Failed to delete hoarding. Please try again.");
      } finally {
        setDeletingId(null); // Reset deleting ID
      }
    }
  };

  const renderLoadingView = () => <LoadingView />;
  const renderFailureView = () => (
    <FailureView message="Something went wrong. Please try again." onRetry={() => setCurrentPage(1)} />
  );

  const renderNoResultsView = () => (
    <div className="no-results-container">
      <img
        src="https://res.cloudinary.com/du8lwvfjj/image/upload/v1758383294/not-result_usbnmo.svg"
        alt="No Results Found"
        className="no-results-img"
      />
      {searchTerm ? (
         <p className="status-message">No results found for "{searchTerm}".</p>
      ) : (
        <>
          <p className="status-message">You haven't added any hoardings yet!</p>
          <p className="status-message">Click 'Add New' to get started.</p>
        </>
      )}
    </div>
  );

  const renderSuccessView = () => (
    <>
      {flexys.length > 0 ? (
        <>
          <div className="notes-list">
            {flexys.map((flexy) => (
              <div key={flexy._id} className="note-item">
                {/* --- Deleting Overlay --- */}
                {deletingId === flexy._id && (
                  <div className="deleting-overlay">
                    <LoadingView />
                  </div>
                )}
                <img src={flexy.imageUrl} alt={flexy.name || 'N/A'} className="flexy-image" />
                <div className="flexy-details">
                  <h3>{flexy.name || 'Untitled Flexy'}</h3>
                  <p><strong>Address:</strong> {flexy.address || 'N/A'}</p>
                  <p><strong>Status:</strong> {flexy.status || 'N/A'}</p>
                  <p><strong>Consultation:</strong> {flexy.consultationStatus?.replace('_', ' ') || 'N/A'}</p>
                  <div className="note-item-actions">
                    <Link to={`/edit-flexy/${flexy._id}`} className="view-details-btn">View / Edit</Link>
                    <button type="button" className="delete-btn" onClick={() => handleDelete(flexy._id)} disabled={deletingId !== null}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1 || deletingId !== null}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || deletingId !== null}>Next</button>
            </div>
          )}
        </>
      ) : (
        renderNoResultsView()
      )}
    </>
  );

  const renderView = () => {
    switch (status) {
      case STATUS.LOADING:
        return renderLoadingView();
      case STATUS.FAILURE:
        return renderFailureView();
      case STATUS.SUCCESS:
        return renderSuccessView();
      default:
        return null;
    }
  };

  return (
    <div className="notes-list-container">
      <div className="header-section">
        <h1>All Flexy's</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, owner, address, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {renderView()}
    </div>
  );
};

export default NotesList;