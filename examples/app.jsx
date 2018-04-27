/* eslint-disable */

import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import { createStorage, createSetting } from '../lib/persistme.min';

const storageDefaults = {
    username: 'User',
    email: 'you@example.com',
};
// usage of global window object is just for demo
// in order to initialize multiple different versions
// of the same app with multiple different storages
// all of which would be using the same `localStorage` keys
// in order to demonstrate how `persistme` provides app namespace
const MyAppStorage = createStorage(window.__appName, storageDefaults);

const defaultSettings = {
    theme: 'green',
    font: 'Comic Sans MS',
};
const UserSetting = createSetting({
    storage: MyAppStorage,
    defaults: defaultSettings,
});

const initialState = {
    username: MyAppStorage.get('username'),
    email: MyAppStorage.get('email'),
    theme: UserSetting.theme,
    font: UserSetting.font,
};

class App extends Component {
    state = initialState;

    handleUsernameChange = ev => {
        const username = ev.target.value;
        MyAppStorage.set('username', username);
        this.setState({ username });
    }

    handleEmailChange = ev => {
        const email = ev.target.value;
        MyAppStorage.set('email', email);
        this.setState({ email });
    }

    handleThemeChange = ev => {
        const theme = ev.target.value;
        UserSetting.theme = theme;
        this.setState({ theme });
    }

    handleFontChange = ev => {
        const font = ev.target.value;
        UserSetting.font = font;
        this.setState({ font });
    }

    render() {
        const { theme, font, username, email } = this.state;
        return (<div>
            <h4>Welcome, <a href={`mailto:${email}`} >{username}</a></h4>

            <form>
                <section>
                    <label>
                        Username:
                    <input
                            type="text"
                            value={username}
                            onChange={this.handleUsernameChange} />
                    </label>
                </section>
                <section>
                    <label>
                        Email:
                    <input
                            type="email"
                            value={email}
                            onChange={this.handleEmailChange} />
                    </label>
                </section>
                <section>
                    Theme:
                <label>
                        <input
                            type="radio"
                            value="black"
                            checked={theme === 'black'}
                            onChange={this.handleThemeChange} />
                        Black
                </label>
                    <label>
                        <input
                            type="radio"
                            value="blue"
                            checked={theme === 'blue'}
                            onChange={this.handleThemeChange} />
                        Blue
                </label>
                    <label>
                        <input
                            type="radio"
                            value="green"
                            checked={theme === 'green'}
                            onChange={this.handleThemeChange} />
                        Green
                </label>
                    <label>
                        <input
                            type="radio"
                            value="red"
                            checked={theme === 'red'}
                            onChange={this.handleThemeChange} />
                        Red
                </label>
                </section>
                <section>
                    Font:
                <label>
                        <input
                            type="radio"
                            value="Arial"
                            checked={font === 'Arial'}
                            onChange={this.handleFontChange} />
                        Arial
                </label>
                    <label>
                        <input
                            type="radio"
                            value="Comic Sans MS"
                            checked={font === 'Comic Sans MS'}
                            onChange={this.handleFontChange} />
                        Comic Sans MS
                </label>
                    <label>
                        <input
                            type="radio"
                            value="Courier"
                            checked={font === 'Courier'}
                            onChange={this.handleFontChange} />
                        Courier
                </label>
                </section>
            </form>

            <div className="preview" style={{ color: theme, fontFamily: font }}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </div>

        </div>);
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
