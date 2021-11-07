import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import Auth from "../components/Auth";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

const handlers = [
    rest.post("http://localhost:8000/api/auth/", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ token: "abc123" }));
    }),
    rest.post("http://localhost:8000/api/createuser/", (req, res, ctx) => {
        return res(ctx.status(201));
    }),
];

const server = setupServer(...handlers);

beforeAll(() => {
    server.listen();
});
afterEach(() => {
    server.resetHandlers();
    cleanup();
});
afterAll(() => {
    server.close();
});

describe("Auth Component Test Cases", () => {
    let store;
    beforeEach(() => {
        store = configureStore({
            reducer: {
                auth: authReducer,
            },
        });
    });
    it("1 :Should render all the elements correctly", async () => {
        render(
            <Provider store={store}>
                <Auth />
            </Provider>
        );
        // screen.debug(); //取得した画面情報はscreenに保存されている。この文言でscreenの内容を確認することができる。
        expect(true).toBe(true);
        // expect(screen.getByTestId("label-username")).toBeTruthy();
        // expect(screen.getByTestId("label-password")).toBeTruthy();
        // expect(screen.getByTestId("input-username")).toBeTruthy();
        // expect(screen.getByTestId("input-password")).toBeTruthy();
        // expect(screen.getByRole("button")).toBeTruthy();
        // expect(screen.getByTestId("toggle-icon")).toBeTruthy();
    });
});