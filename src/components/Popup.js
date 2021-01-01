import './App.scss';
import 'antd/dist/antd.css';
import {Checkbox} from 'antd';
import * as React from 'react';

class Popup extends React.Component {

    async componentDidMount() {
        const profileCheckboxes = await Promise.all(this.profileCheckboxes.map(item => getItem(item.name)))
        this.setState(profileCheckboxes.reduce((acc, curr, index) => ({[this.profileCheckboxes[index].name]: curr, ...acc}), {}));

        const videoCheckboxes = await Promise.all(this.videoCheckboxes.map(item => getItem(item.name)))
        this.setState(videoCheckboxes.reduce((acc, curr, index) => ({[this.videoCheckboxes[index].name]: curr, ...acc}), {}));
    }

    profileCheckboxes = [
        {name: 'Profile:Views', text: 'Enable Views'},
        {name: 'Profile:Shares', text: 'Enable Shares'},
        {name: 'Profile:Comments', text: 'Enable Comments'},
        // {name: 'Profile:Average likes', text: 'Enable Average likes'},
        {name: 'Profile:Average views', text: 'Enable Average views'},
        {name: 'Profile:Average shares', text: 'Enable Average shares'},
        {name: 'Profile:Average comments', text: 'Enable Average comments'},
        {name: 'Profile:Average ER', text: 'Enable Average ER'},
        {name: 'Profile:Average created time', text: 'Enable Average created time'},
        {name: 'Profile:Average videos per day', text: 'Enable Average videos per day'}
    ]

    videoCheckboxes = [
        {name: 'Video:Likes', text: 'Enable Likes'},
        {name: 'Video:Shares', text: 'Enable Shares'},
        {name: 'Video:Comments', text: 'Enable Comments'},
        {name: 'Video:ER', text: 'Enable ER'},
        {name: 'Video:Sort by ER', text: 'Enable sorting by ER'},
    ]

    state = {};

    render() {
        return (
            <div className="profile-container">
                <div className="logo">
                    <img src="../images/icon_128x128.png" alt=""/>
                    <h1>Tiktok Profile Analyzer</h1>
                </div>
                <div className="checkbox-group">
                    <h2>Profile</h2>
                    <div className="checkbox-container">
                        {this.profileCheckboxes.map(checkbox =>
                            <Checkbox checked={this.state[checkbox.name]}
                                      onChange={(e) => this.onChange(e, checkbox.name)}>{checkbox.text}</Checkbox>)}
                    </div>
                </div>
                <div className="checkbox-group">
                    <h2>Video</h2>
                    <div className="checkbox-container">
                        {this.videoCheckboxes.map(checkbox =>
                            <Checkbox checked={this.state[checkbox.name]}
                                      onChange={(e) => this.onChange(e, checkbox.name)}>{checkbox.text}</Checkbox>)}
                    </div>
                </div>
            </div>
        );
    }

    async onChange(e, storageName) {
        this.state[storageName] = e.target.checked;
        this.setState(this.state);

        await setItem(storageName, this.state[storageName]);
    }
}

async function getItem(name) {
    if (!chrome?.storage) {
        return localStorage.getItem(name);
    }
    return new Promise(resolve => {
        chrome.storage.sync.get(name, data => {
            resolve(data[name]);
        });
    });
}

async function setItem(name, value) {
    if (!chrome?.storage) {
        return localStorage.setItem(name, value);
    }
    return new Promise(resolve => {
        chrome.storage.sync.set({[name]: value}, data => {
            resolve(data);
            console.log(data);
        });
    });
}


export default Popup;
