import './App.css';
import {BrowserRouter , Routes , Route} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Main from "./components/Main";

function App({baseUrl}) {
  return (
    <div>
          <BrowserRouter>
              <Routes>
                <Route path='/' element={<Main baseUrl={baseUrl}/>}/>
                <Route path='/signin' element={<SignIn baseUrl={baseUrl}/>}/>
                <Route path='/signup' element={<SignUp baseUrl={baseUrl}/>}/>
              </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
