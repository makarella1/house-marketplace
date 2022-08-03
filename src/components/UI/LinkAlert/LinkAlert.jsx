const LinkAlert = () => {
  return (
    <div className="toast bottom-16 right-0 z-[1000] lg:bottom-20 lg:right-5">
      <div className="alert alert-sucess">
        <div>
          <span className="font-bold">
            The link was copied to your clipboard!
          </span>
        </div>
      </div>
    </div>
  );
};
export default LinkAlert;
