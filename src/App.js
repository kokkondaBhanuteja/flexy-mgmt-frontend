import { Routes, Route } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotesList from './components/NotesList';
import NoteDetails from './components/NoteDetails';
import FlexyRouteFinder from './components/FlexyRouteFinder';
import ContactForm from './components/ContactForm'; 
import NotFound from './components/NotFound';
import LoadingView from './components/LoadingView'; 
import './App.css';

const MAPS_API = process.env.REACT_APP_GOOGLE_MAPS_API;
const libraries = ['places', 'geometry']; 

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAPS_API,
    libraries: libraries,
  });

  if (loadError) {
    return <div>Map loading failed. Please check your API key.</div>;
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        {isLoaded ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/view-all-flexy" element={<NotesList />} />
            <Route path="/edit-flexy/:id" element={<NoteDetails />} />
            <Route path="/route-finder" element={<FlexyRouteFinder />} />
            <Route path="/contact" element={<ContactForm />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <LoadingView />
        )}
      </main>
    </div>
  );
}

export default App;