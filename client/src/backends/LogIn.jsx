// import React, {Component} from 'react';
// //import GoogleLogin from 'react-google-login';
// import {PostData} from './PostData';
// import {Redirect} from 'react-router-dom';

// class LogIn extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//         loginError: false,
//         redirect: false
//     };
//     this.signup = this.signup.bind(this);
//     }



//     render() {

//         if (this.state.redirect || sessionStorage.getItem('userData')) {

//             console.log("redirecting!");
//             //return (<Redirect to={'/home'}/>)
//         }
//         console.log("run4");


//         const responseGoogle = (response) => {
//             console.log("google console");
//             console.log(response);
//             this.signup(response);
//         }
//         console.log("run")
//         return (

//         <div>
//         <h2 id="welcomeText">LOGIN</h2>
//         <GoogleLogin
//         clientId = {process.env.CLIENT_ID}
//         buttonText="Login with Google"
//         onSuccess={responseGoogle}
//         onFailure={responseGoogle}/>
//         </div>
//         );
//         }
// }
// export default LogIn;

