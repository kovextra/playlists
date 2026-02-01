import CenterDisplay from "./CenterDisplay";

let message = (
  <h1 className="text-3xl p-5">
    <div className="text-blue-800 text-5xl m-5">404 Error:</div>Sorry, this page
    can't be found
  </h1>
);
function MissingPage() {
  return <CenterDisplay props={message}></CenterDisplay>;
}

export default MissingPage;
