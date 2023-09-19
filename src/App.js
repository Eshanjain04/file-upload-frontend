import './App.css';
import {BrowserRouter , Routes , Route} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Main from "./components/Main";

function App() {
  return (
    <div>
          <BrowserRouter>
              <Routes>
                <Route path='/' element={<Main/>}/>
                <Route path='/signin' element={<SignIn/>}/>
                <Route path='/signup' element={<SignUp/>}/>
              </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
