/* Using "pnpm" as a package manager introduced Typing issues with Redux Toolkit, from "immer" and "redux-thunk",
so we had to install the two and reference them in order to succeed TypeScript compilation.
See https://github.com/reduxjs/redux-toolkit/pull/473#issuecomment-1266554741 */
/// <reference types="immer" />
