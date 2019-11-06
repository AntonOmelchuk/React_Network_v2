import React, {useState} from 'react';
import style from './Dialogs.module.css'
import avatar from '../../assets/avatars/eliot.jpg'
import {connect} from 'react-redux';
import {sendMessage} from '../../actions/dialogsActions';

const CurrentDialog = ({dialog, sendMessage}) => {

    const [message, setMessage] = useState('');

    if(dialog === null) {
        return <h3>No messages</h3>
    } else {
        const {messages, user} = dialog;

        const handleChange = e => {
            setMessage(e.target.value)
        };

        const handleKeyDown = (e) => {
            if(e.key === 'Enter') {
                const messageObj = {
                    text: message,
                    isYour: true
                };
                sendMessage(messageObj);
                setMessage('');
            }
        };

        const onSendMessage = () => {
            const messageObj = {
                text: message,
                isYour: true
            };
            sendMessage(messageObj);
            setMessage('')
        };

        return (
            <div className={style.current__dialog}>
                {messages.map(message => (
                    <div className={message.isYour ? style.profile__message : style.message}>
                        <div className={style.current__avatar}>
                            <img src={message.isYour ? avatar : user} alt='avatar' />
                        </div>
                        <div>
                            {message.text}
                        </div>
                    </div>
                ))}
                <div className={style.add__message}>
                    <input type='text' value={message} onChange={handleChange} onKeyDown={handleKeyDown} />
                    <button type='button' onClick={onSendMessage}>Send</button>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    dialog: state.dialogs.current
});

export default connect(mapStateToProps, {sendMessage})(CurrentDialog);
