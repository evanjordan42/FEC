import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import _ from 'underscore';
import captureQandA from '../../hoc/captureQandA';
import URL from '../../URL';

var AddAnswer = (
  {
    questionId, questionBody, productName, handleAddAnswerModal,
    answer, nickname, email,
    setAnswer, setNickname, setEmail,
    logger
  }
) => {
  const [ isAnswerEmpty, setIsAnswerEmpty ] = useState(false);
  const [ isNicknameEmpty, setisNicknameEmpty ] = useState(false);
  const [ isEmailEmpty, setIsEmailEmpty ] = useState(false);
  const [ isEmailFormatInvalid, setIsEmailFormatInvalid ] = useState(false);
  const [ isSubmitted, setIsSubmitted ] = useState(false);

  useEffect(() => {
    if (isSubmitted) setIsSubmitted(false);
  }, [ answer, nickname, email ]);

  const handleChange = e => {
    let value = e.target.value
    if (e.target.name === 'answer') setAnswer(value);
    if (e.target.name === 'nickname') setNickname(value);
    if (e.target.name === 'email') setEmail(value);
  };

  const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    let answerHasContent = answer.length > 0;
    let nicknameHasContent = nickname.length > 0;
    let emailHasContent = email.length > 0;
    let emailFormatIsValid = validateEmail(email);
    let allValid = answerHasContent && nicknameHasContent && emailHasContent && emailFormatIsValid;

    setIsAnswerEmpty(false);
    setisNicknameEmpty(false);
    setIsEmailEmpty(false);
    setIsEmailFormatInvalid(false);

    if (allValid) {
      let body_params = {
        name: _.escape(nickname),
        email: _.escape(email),
        body: _.escape(answer)
      };
      axios.post(`${URL}/questions/${questionId}/answer/add`, body_params)
        .then(() => {
            setAnswer('');
            setNickname('');
            setEmail('');
            setIsSubmitted(true);
          })
        .catch(() => console.error('error'));
    } else {
      if (!answerHasContent) setIsAnswerEmpty(true);
      if (!nicknameHasContent) setisNicknameEmpty(true);
      if (!emailHasContent) setIsEmailEmpty(true);
      if (!emailFormatIsValid) setIsEmailFormatInvalid(true);
    }
  }

  let highlightErrorAnswer = isAnswerEmpty ? {borderColor: '#eb643f', boxShadow: '0 0 10px #eb643f' } : {};
  let highlightErrorNickname = isNicknameEmpty ? {borderColor: '#eb643f', boxShadow: '0 0 10px #eb643f' } : {};
  let highlightErrorEmail = isEmailEmpty || isEmailFormatInvalid ? {borderColor: '#eb643f', boxShadow: '0 0 10px #eb643f' } : {};

  return (
    <React.Fragment>
      <div className="modal-focus" onClick={handleAddAnswerModal}></div>
      <div className="modal-add">
        <ion-icon
          size="large"
          name="close-outline"
          onClick={handleAddAnswerModal}></ion-icon>
        <div className="center">
          <h1>Submit your Answer</h1>
          <div className="qa-body">{productName}: {questionBody}</div>
          {
            isSubmitted ?
            <div className="confirmed">Answer submitted <ion-icon name="checkmark-outline"></ion-icon></div>
            : null
          }
        </div>
        <div className="error-messages">
          {
            isAnswerEmpty || isNicknameEmpty || isEmailEmpty || isEmailFormatInvalid ?
            <div>You must enter the following:</div>
            : null
          }
          { isAnswerEmpty ? <div className="mandatory">Answer cannot be empty</div> : null }
          { isNicknameEmpty ? <div className="mandatory">Nickname cannot be empty</div> : null }
          { isEmailEmpty ? <div className="mandatory">Email cannot be empty</div> : null }
          { isEmailFormatInvalid ? <div className="mandatory">Email must be a valid email address</div> : null }
        </div>
        <form>
          <label>
            <span className="modal-label">Your Answer</span><sup className="mandatory">&nbsp;*</sup>
            <textarea
              name="answer"
              rows="5"
              maxLength="1000"
              style={highlightErrorAnswer}
              value={answer}
              onChange={handleChange}></textarea>
          </label>
          <div className="flex">
            <div className="modal-user-data">
              <label>
                <span className="modal-label">What is your nickname</span><sup className="mandatory">&nbsp;*</sup>
                <input
                  type="text"
                  name="nickname"
                  placeholder="Example: jackson11!"
                  style={highlightErrorNickname}
                  value={nickname}
                  onChange={handleChange}></input>
                <span className="disclaimer-small">For privacy reasons, do not use your full name or email address</span>
              </label>
            </div>
            <div className="flex-grow"></div>
          </div>
          <div className="flex">
            <div className="modal-user-data">
              <label>
                <span className="modal-label">Your email</span><sup className="mandatory">&nbsp;*</sup>
                <input
                  type="text"
                  name="email"
                  placeholder="Example: jack@email.com"
                  style={highlightErrorEmail}
                  value={email}
                  onChange={handleChange}></input>
                <span className="disclaimer-small">For authentication reasons, you will not be emailed</span>
              </label>
            </div>
            <div className="flex-grow"></div>
          </div>
          <input
            type="submit"
            value="Submit"
            onClick={e => {
              handleSubmit(e);
              logger(e);
            }}></input>
        </form>
      </div>
    </React.Fragment>
  );
};

export default captureQandA(AddAnswer);

AddAnswer.propTypes = {
  questionId: PropTypes.number,
  questionBody: PropTypes.string,
  productName: PropTypes.string,
  handleAddAnswerModal: PropTypes.func,
  answer: PropTypes.string,
  nickname: PropTypes.string,
  email: PropTypes.string,
  setAnswer: PropTypes.func,
  setNickname: PropTypes.func,
  setEmail: PropTypes.func,
  logger: PropTypes.func
}