import {useEffect, useState} from "react"
import mykhailo from "../../assets/images/content/aboutUs/Mykhailo.jpeg";
import roman from "../../assets/images/content/aboutUs/Roma.jpg";
import rusana from "../../assets/images/content/aboutUs/Rusana.jpeg";
import anastasiia from "../../assets/images/content/aboutUs/Anastasiia.jpeg";

export const AboutUsPage = () => {
  const [missionImage, setMissionImage] = useState<string | null>(null)
  
  useEffect(() => {
      fetch(
        "https://pixabay.com/api/?key=4909168-7f27b7a457209e43d27004058&q=happy&category=people&per_page=200"
      ).then((res) => {
        res.json().then((res) => {
          const numOfImg = Math.floor(Math.random() / 0.005);
          console.log(numOfImg);
          setMissionImage(res.hits[numOfImg].largeImageURL);
          return;
        });
      });
  }, [])


  return (
    <section className="aboutUs">
      <div className="container">
        <div className="aboutUs__missionBlock">
          <div className="aboutUs__missionBlock_item">
            <h3 className="title">Our mission</h3>
            <p>
              Welcome to <strong>Dream Are Here</strong> – the platform where
              dreams come true! 🌟 We created this space for those who want to
              share their wishes and find people willing to help make them a
              reality. Here, you can post your dream – big or small – and
              receive support from other users. Or, on the other hand, you can
              be the one who helps someone take a step toward their dream.
            </p>
            <p>
              <strong>Dream Are Here</strong> is not just a platform, it’s a
              community where people come together for inspiration, good deeds,
              and new opportunities. After all, every fulfilled dream brings the
              world closer to something beautiful!💫
            </p>
            <p>Join us and make miracles happen together!🚀</p>
          </div>
          <div className="aboutUs__missionBlock_item">
            <img src={missionImage ?? ""} alt="" />
          </div>
        </div>
        <div className="aboutUs__teamBlock">
          <h3 className="title">Our team</h3>
          <div className="aboutUs__teamContainer">
            <div className="aboutUs__teamItem">
              <div className="aboutUs__teamSubItem">
                <img src={mykhailo} alt="" />
              </div>
              <div className="aboutUs__teamSubItem">
                <h3>Mykhailo</h3>
                <p>Front-end developer</p>
              </div>
            </div>
            <div className="aboutUs__teamItem">
              <div className="aboutUs__teamSubItem">
                <img src={roman} alt="" />
              </div>
              <div className="aboutUs__teamSubItem">
                <h3>Roman</h3>
                <p>Back-end developer</p>
              </div>
            </div>
            <div className="aboutUs__teamItem">
              <div className="aboutUs__teamSubItem">
                <img src={rusana} alt="" />
              </div>
              <div className="aboutUs__teamSubItem">
                <h3>Rusana</h3>
                <p>QA-enginier</p>
              </div>
            </div>
            <div className="aboutUs__teamItem">
              <div className="aboutUs__teamSubItem">
                <img src={anastasiia} alt="" />
              </div>
              <div className="aboutUs__teamSubItem">
                <h3>Anastasiia</h3>
                <p>UI/UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}