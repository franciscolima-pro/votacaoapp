import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "../src/pages/Home";
import NovaEnquete from "../src/pages/NovaEnquete";
import EditarEnquete from  "../src/pages/Editarenquete";
import VotarEnquete from "../src/pages/VotarEnquete";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/nova" element={<NovaEnquete />} />
          <Route path="/editar/:id" element={<EditarEnquete />} />
          <Route path="/votar/:id" element={<VotarEnquete />} /> 
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
