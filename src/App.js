import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotesList from './components/NotesList';
import NoteDetails from './components/NoteDetails';
import FlexyRouteFinder from './components/FlexyRouteFinder';
import ContactForm from './components/ContactForm'; 
import NotFound from './components/NotFound';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-all-flexy" element={<NotesList />} />
          <Route path="/edit-flexy/:id" element={<NoteDetails />} />
          <Route path="/route-finder" element={<FlexyRouteFinder />} />
          <Route path="/contact" element={<ContactForm />} /> 
            <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;