import welcome from "../assets/welcome.png";

const Welcome = () => {
  return (
    <div className="flex-1">
      <img src={welcome} className="w-full h-full" />
    </div>
  );
};

export default Welcome;
