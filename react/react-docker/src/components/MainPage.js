import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//CSSやアイコン,Bootstrap関係
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Nav, Navbar, ListGroup, Card } from 'react-bootstrap';
import styles from "./MainPage.module.css";
import { VscAdd } from "react-icons/vsc";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import useMediaQuery from '@material-ui/core/useMediaQuery';
//独自実装
import { fetchAsyncGetProfile, selectProfile } from "../features/authSlice";
import {
    fetchAsyncGetMyNotes,
    fetchAsyncCreateNote,
    fetchAsyncUpdateNote,
    fetchAsyncDeleteNote,
    editNote,
    selectNotes,
    selectEditedNote,
} from "../features/noteSlice";




const MainPage = () => {
    //画面読み込み時にログインしている場合(Tokenを所持している場合)でないときにlogin画面に遷移させる
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchBootLoader = async () => {
            const result = await dispatch(fetchAsyncGetProfile());
            if (fetchAsyncGetProfile.rejected.match(result)) {
                history.push("/");
            }
        };
        fetchBootLoader();
    }, [dispatch, history]);

    //画面の大きさごとに、また「>」「<」(開く・閉じるボタン)ごとにサイドバーを操作する
    const [isOpenMenu, setIsOpenMenu] = useState(false); //TODO trueとfalseが大変わかりにくいので、整理する
    const matches = useMediaQuery('(min-width:768px)');
    const openMenuCss = {
        //サイドバーが開いているときのCSS
    }
    const closeMenuCss = {
        //サイドバーが閉じているときのCSS ただしmatchesによって画面が768px以上か以下かによって値を変更する。
        marginLeft: matches ? '-15rem' : 0
    }

    //ログアウト機能の実装
    const Logout = () => {
        localStorage.removeItem("token");
        history.push("/");
    };

    // Note一覧を取得し設定する
    const [submitResultMsg, setSubmitResultMsg] = useState("");
    const notes = useSelector(selectNotes);
    const editedNote = useSelector(selectEditedNote);
    useEffect(() => {
        const fetchBootLoader = async () => {
            const result = await dispatch(fetchAsyncGetMyNotes());
            if (fetchAsyncGetMyNotes.rejected.match(result)) {
                setSubmitResultMsg("Get error!");
            }
        };
        fetchBootLoader();
    }, [dispatch]);
    const createNote = async (editNoteUpdateFlag) => {
        const res = await dispatch(
            fetchAsyncCreateNote({
                title: editedNote.title,
                body: editedNote.body,
            })
        );
        if (editNoteUpdateFlag) {
            await dispatch(editNote(res.payload));
        }
    }
    const updateNote = async () => {
        await dispatch(
            fetchAsyncUpdateNote(editedNote)
        );
    }
    const deleteNote = async () => {
        await dispatch(
            fetchAsyncDeleteNote(editedNote.id)
        );
    }
    const resetNote = async () => {
        await dispatch(
            editNote({
                id: 0,
                title: "",
                body: "",
            })
        );
    }
    const onClickSave = () => {
        if (editedNote.id === 0) {
            createNote(true);
        } else {
            updateNote();
        }
    }
    const onClickDelete = () => {
        if (editedNote.id === 0) {
            resetNote();
        } else {
            deleteNote();
            resetNote();
        }
    }
    const onClickNewNote = () => {
        if (editedNote.id === 0) {
            createNote(false);
        } else {
            updateNote();
        }
        resetNote();
    }

    return (
        <>
            <div className="d-flex" style={{ overflowX: 'hidden' }} id="wrapper" >
                {/* <!-- Sidebar--> */}
                <div className="border-end bg-white toggled" style={isOpenMenu ? closeMenuCss : openMenuCss} id={styles.sidebar_wrapper}>
                    <Container className="border-bottom bg-light" style={{ padding: '0.75rem 1.25rem', fontSize: '1.2rem' }}>
                        <Row>
                            <Col>メニュー</Col>
                            <Col xs xs="3">
                                <button type="button" className="btn btn-success rounded-circle p-0" onClick={onClickNewNote} style={{ width: '2rem', height: '2rem' }}><VscAdd /></button>
                            </Col>
                        </Row>
                    </Container>
                    <ListGroup variant="flush" style={{ maxHeight: '45rem', width: '15rem', overflow: 'scroll' }} >
                        <Container>
                            {notes.map((note) => (
                                <Card border="secondary mt-2 mb-2" key={note.id} onClick={async () => {
                                    await dispatch(editNote(note));
                                }} className={styles.textCard} >
                                    <Card.Body>
                                        <Card.Title>{note.title || '無題'}</Card.Title>
                                        <Card.Text>{note.body}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Container>
                    </ListGroup>
                </div>
                {/* <!-- Page content wrapper--> */}
                <div style={{ width: '100%' }} >
                    {/* <!-- Top navigation--> */}
                    <Navbar variant="light" bg="light" expand="lg" style={{ width: '100%' }} className="border-bottom">
                        <Container fluid>
                            <Button variant="primary" onClick={() => setIsOpenMenu(!isOpenMenu)} >{isOpenMenu ? (matches ? <GoChevronRight /> : <GoChevronLeft />) : (matches ? <GoChevronLeft /> : <GoChevronRight />)}</Button>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ms-auto mt-2 mt-lg-0">
                                    {/* <Nav.Item><Nav.Link href="/about">このサイトについて</Nav.Link></Nav.Item> */}
                                    <Nav.Item><Nav.Link href="/" onClick={Logout} >ログアウト</Nav.Link></Nav.Item>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    {/* <!-- Page content--> */}
                    <div className="container-fluid">
                        <Form>
                            <Button variant="primary" name="login-submit" className="center-block mt-3 mx-2" onClick={onClickSave}>
                                保存
                            </Button>
                            <Button variant="danger" name="login-submit" className="center-block mt-3 mx-2" onClick={onClickDelete}>
                                削除
                            </Button>
                            <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="text" placeholder="題名" value={editedNote.title} onChange={async (e) =>
                                    await dispatch(
                                        editNote({ ...editedNote, title: e.target.value })
                                    )
                                } />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Control as="textarea" rows={3} style={{ height: '60vh' }} placeholder="内容" value={editedNote.body} onChange={async (e) =>
                                    await dispatch(
                                        editNote({ ...editedNote, body: e.target.value })
                                    )
                                } />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainPage
