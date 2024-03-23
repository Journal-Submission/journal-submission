import React, { useEffect, useState } from "react";
import "./signup-style.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import Auth from "../../services/authService";
import MailService from "../../services/mailService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

function SignUp() {
    const location = useLocation();
    const [emailOtp, setEmailOtp] = useState(0);
    const [loader, setLoader] = useState(false);
    const [credentials, setCredentials] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confPassword: "",
        gender: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        setEmailOtp(Math.floor(1000 + Math.random() * 900000));
    }, [setEmailOtp]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!event.target['alert-policy'].checked) {
            toast.error('Please accept the Terms, Privacy & Policy.');
            return;
        }
        setLoader(true);
        const responseData = await Auth.register(credentials);
        if (responseData.success) {
            const resMailData = await MailService.sendMail({
                mailFrom: "Journal Submission",
                mailTo: credentials.email,
                mailSubject: "Verify your email address",
                mailText: "Please verify your email address using OTP to complete registration.",
                mailHtml: `
                    <div style="border: 2px solid aqua; border-radius: 5px; padding: 10px;">
                        Hi ${credentials.firstName},
                        <p>
                            Thank you for registering with us. Please use the following OTP to confirm your email address.
                        </p>
                        <div style="display: flex; justify-content: center; margin: 30px 0;">
                            <button style="padding: 12px 39px; font-size: larger; font-weight: bold; outline: none; border: medium; background-color: #0040ff; color: wheat;border-radius: 6px;">${emailOtp}</button>
                        </div>
                        <p>Thanks,
                            <br>
                            Team XYZ
                        </p>
                    </div>
                `
            });
            if (resMailData.success) {
                navigate("/sign-up/verify-email", { state: { email: credentials.email, emailOtp: emailOtp, redirectTo: location.state?.redirectTo } });
                toast.success('Registration successful. Please verify your email address.');
                setLoader(false);
            }
        }
        else {
            toast.error(responseData.message);
            setLoader(false);
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const autoGenerateUsername = (e) => {
        if (credentials.firstName === "") return;
        if (e.target.checked) {
            setCredentials({ ...credentials, userName: credentials.firstName.toLowerCase() + Math.floor(Math.random() * 1000) });
        }
        else {
            setCredentials({ ...credentials, userName: "" });
        }
    }

    return (
        <>
            {
                (location.pathname === "/sign-up/verify-email") ? <Outlet /> :
                    <section className="signup-section d-flex justify-content-center align-items-center">
                        <div className="signup-wrapper">
                            <h5 className="main_heading text-center">REGISTRATION</h5>
                            <hr className="bottom-rule" />
                            {/* form elements */}
                            <form onSubmit={handleSubmit}>
                                <div className="content">
                                    <div className="input-control">
                                        <label htmlFor="first_name">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            name="firstName"
                                            id="first_name"
                                            autoComplete="on"
                                            value={credentials.firstName}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="middle_name">Middle Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Middle name"
                                            name="middleName"
                                            id="middle_name"
                                            value={credentials.middleName}
                                            onChange={onChange}
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Last name"
                                            name="lastName"
                                            id="last_name"
                                            value={credentials.lastName}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="username">
                                            Username &#40;<span>&nbsp;
                                                <input
                                                    type="checkbox"
                                                    style={{ width: "auto", height: "auto" }}
                                                    onChange={autoGenerateUsername}
                                                />
                                                &nbsp;Auto generated </span>&#41;
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            name="userName"
                                            id="username"
                                            autoComplete="on"
                                            value={credentials.userName}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter valid email address"
                                            name="email"
                                            id="email"
                                            autoComplete="on"
                                            value={credentials.email}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="phone_number">Phone number</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            name="phoneNumber"
                                            id="phone_number"
                                            autoComplete="on"
                                            value={credentials.phoneNumber}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            name="password"
                                            id="password"
                                            value={credentials.password}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-control">
                                        <label htmlFor="confPassword">Confirm Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            name="confPassword"
                                            id="confPassword"
                                            value={credentials.confPassword}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <span className="gender-title">Gender</span>
                                    <div className="gender_category">
                                        <input type="radio" name="gender" id="male"
                                            value="male"
                                            onChange={onChange}
                                        />
                                        <label htmlFor="male">Male</label>
                                        <input type="radio" name="gender" id="female"
                                            value="female"
                                            onChange={onChange}
                                        />
                                        <label htmlFor="female">Female</label>
                                        <input type="radio" name="gender" id="other"
                                            value="other"
                                            onChange={onChange}
                                        />
                                        <label htmlFor="other">Other</label>
                                    </div>
                                </div>
                                {/* terms & condition */}
                                <div className="policy">
                                    <label className="policy-text" htmlFor="policy-btn">
                                        <input type="checkbox" name="alert-policy" id="policy-btn" /> By
                                        clicking sign up, you agree to our{" "}
                                        <Link to="/sign-up">Terms,</Link>{" "}
                                        <Link to="/sign-up">Privacy & Policy</Link>. You may receive sms
                                        notifications from us and can opt out at any time.
                                    </label>
                                </div>
                                {/* signup button */}
                                <div className="button-container">
                                    {loader ? <button type="submit" className="d-flex justify-content-center"><ThreeDots
                                        height={28}
                                        width={54}
                                    /></button> :
                                        <button type="submit">Sign up</button>}
                                </div>
                                <p className="text-center mt-lg-3 is-account">
                                    Already have an account, please <Link to="/login" state={{ redirectTo: location.state?.redirectTo }}>Login</Link>.
                                </p>
                            </form>
                        </div>
                    </section>
            }
        </>
    );
}

export default SignUp;