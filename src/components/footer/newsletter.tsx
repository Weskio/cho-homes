const Newsletter = () => {
  return (
    <form className="flex items-center max-w-lg mx-auto">
      <label className="sr-only" htmlFor="voice-search">Search</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <img src="/images/mail-icon.png" alt="" />
        </div>
        <input required placeholder="Enter your email" className="bg-dark-100 border border-dark-50 text-dark-10 text-sm rounded-lg block w-full ps-12  p-2.5 px-8 dark:border-gray-600 placeholder:text-dark-10 placeholder:font-semibold" id="voice-search" type="text" />
        <button className="absolute inset-y-0 end-0 flex items-center pe-3" type="button">
          <img src="/images/send-icon.png" alt="" />
        </button>
      </div>
    </form>
  );
}

export default Newsletter;
