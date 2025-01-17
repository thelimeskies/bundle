import Link from "next/link";
import Image from "next/image";
import Sidebar from "../../../components/sidebar";
import Chart from "../../../components/chart";
import Notify from "../../../images/icons/notify.svg";
import Avatar from "../../../images/icons/avatar.svg";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Settings() {
  const [name, setName] = useState();
  const [narration, setNarration] = useState();
  const [timeline, setTimeline] = useState();
  const [account, setAccount] = useState();
  const [formComplete, setFormComplete] = useState(true);
  const [btn, setBtn] = useState("Request");
  const [err, setErr] = useState();
  const [success, setSuccess] = useState();
  const [showMessage, setShowMessage] = useState(false);

  function handleModal() {
    setShowMessage(false);
    console.log("reached");
  }

  const [acc, setAcc] = useState();
  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    setAcc(accounts);
  }, []);

  async function handleSend(e) {
    e.preventDefault();

    if (!name || !narration || !timeline || !account) {
      setFormComplete(false);
      return;
    }

    setFormComplete(true);
    setBtn("Please wait...");
    const load = {
      receiver: name,
      reason: narration,
      timeline: timeline,
      mono_id: account,
    };

    console.log(load);

    const key = localStorage.getItem("token");
    const auth = `token${" "}${key}`;
    try {
      axios({
        method: "post",
        url: "https://bundle-backend.herokuapp.com/connect/sendstatement/",
        data: JSON.stringify(load),
        headers: { "Content-Type": "application/json", Authorization: auth },
      })
        .then((res) => {
          console.log(res.data);
          setBtn("Request");
          setSuccess(true);
          setShowMessage(true);
          setName("");
          setNarration("");
          setTimeline("");
          setAccount("");
        })
        .catch((err) => {
          setBtn("Request");
          setErr("An error occured while trying to send statement");
          setShowMessage(true);
          setName("");
          setNarration("");
          setTimeline("");
          setAccount("");
        });
    } catch (err) {
      setBtn("Request");
      setErr("An error occured");
      setShowMessage(true);
      setName("");
      setNarration("");
      setTimeline("");
      setAccount("");
    }
  }

  return (
    <>
      <div className="settings dash">
        <Sidebar activeTab="send" />

        <div className="statement__details dash__details settings__details">
          <nav className="dash-nav">
            <h2>Send Statement</h2>

            <div className="dash-nav__items">
              <Link href="/">
                <p>Logout</p>
              </Link>
              <div className="dash-nav__notify">
                <Image width={25} height={25} src={Notify} alt="notification" />
              </div>
              <Link href="./settings">
                <div className="dash-nav__user">
                  <Image
                    width={30}
                    height={30}
                    src={Avatar}
                    alt="user profile picture"
                  />
                </div>
              </Link>
            </div>
          </nav>
          <div className="personal__info">
            <div className="personal__info__items">
              <div className="personal__info__item">
                <h5>Receiver’s bundle username</h5>
                <input type="text" className="send__input" name="send__input" />
              </div>

              <div className="personal__info__item">
                <h5>Timeline</h5>
                <select
                  className="statement__account-options"
                  id="account-options"
                >
                  <option value="" default disabled>
                    Select Timeline
                  </option>
                  <option value="Last 6 months">Last 6 months</option>
                  <option value="Last 12 months">Last 12 months</option>
                </select>
              </div>

              <div className="personal__info__item">
                <h5>Select Account</h5>

                <select
                  className="statement__account-options"
                  id="account-options"
                >
                  <option value="" default disabled>
                    Select Account
                  </option>
                  {acc
                    ? acc.map((unit, index) => (
                        <option value={acc[index].account_name}>
                          {acc[index].account_name}
                        </option>
                      ))
                    : null}
                </select>
              </div>

              {/* <div className="personal__info__item">
                <h5>End Date</h5>
                <input 
                  type="date" 
                  className="send__input" 
                  name="send__input" 
                  // you can delete this
                />
              </div> */}

              <div className="personal__info__item">
                <h5>Narration/reason</h5>
                <textarea
                  className="send__input"
                  rows={10}
                  cols={10}
                  name="send__input"
                ></textarea>
              </div>

              <div className="personal__info__item personal__info__item-btn personal__info__item-send">
                <button>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="small-screen__alert">
        <p>
          Sorry, this dashboard is not available on smaller screens. Switch to a
          desktop device and try again
        </p>
      </div>
    </>
  );
}
