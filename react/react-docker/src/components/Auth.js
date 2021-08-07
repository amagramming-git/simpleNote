import React, { useState } from "react";
import logo from './logo.svg';
import styles from "./Auth.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Nav, Alert } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAsyncLogin, fetchAsyncRegister } from "../features/authSlice";
import { useForm } from 'react-hook-form'


const Auth = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [submitResultMsg, setSubmitResultMsg] = useState("");

    const login = async () => {
        const result = await dispatch(
            fetchAsyncLogin({ username: username, password: password })
        );
        if (fetchAsyncLogin.fulfilled.match(result)) {
            history.push("/home");
        } else {
            setSubmitResultMsg("Login error!");
        }
    };
    const authUser = async (e) => {
        // e.preventDefault();
        if (isLogin) {
            login();
        } else {
            const result = await dispatch(
                fetchAsyncRegister({ username: username, password: password })
            );
            if (fetchAsyncRegister.fulfilled.match(result)) {
                login();
            } else {
                setSubmitResultMsg("Registration error!");
            }
        }
        return false
    };
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <div style={{ paddingTop: "90px" }}>
            <Container className="text-center"><img className="mb-4" src={logo} alt="" width="200" height="200"></img></Container>
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <div className={`${styles.panel_login} ${styles.panel}`} >
                            <Nav justify variant="pills" defaultActiveKey="1"  >
                                <Nav.Item>
                                    <Nav.Link eventKey="1" onSelect={() => setIsLogin(true)}>ログイン</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="2" onSelect={() => setIsLogin(false)}>新規登録</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <div className="panelBody">
                                <Row>
                                    <Col lg={12}>
                                        {submitResultMsg && <Alert variant='danger' className="m-2" >Login error</Alert>}
                                        <Form onSubmit={handleSubmit(authUser)} >
                                            <Form.Group className="m-3" controlId={'username'} >
                                                <Form.Control type="text" placeholder="Username" value={username} {...register('username', {
                                                    required: "必須項目です"
                                                })} onChange={(e) => setUsername(e.target.value)} />
                                                {errors.username && <Form.Text className="text-danger" type="invalid">{errors.username.message}</Form.Text>}
                                            </Form.Group>
                                            <Form.Group className="m-3" controlId="password">
                                                <Form.Control type="password" placeholder="Password" value={password} {...register('password', {
                                                    required: "必須項目です",
                                                    minLength: {
                                                        value: 8,
                                                        message: '8文字以上で指定してください'
                                                    }
                                                })} onChange={(e) => setPassword(e.target.value)} />
                                                {errors.password && <Form.Text className="text-danger" type="invalid">{errors.password.message}</Form.Text>}
                                            </Form.Group>
                                            <Col className="text-center mb-3">
                                                <Button variant="primary" name="login-submit" type="submit" className="center-block" onClick={() => setSubmitResultMsg("")}>
                                                    {isLogin ? "ログイン" : "新規登録"}
                                                </Button>
                                            </Col>
                                        </Form>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >
        </div>
    );
};

export default Auth;
