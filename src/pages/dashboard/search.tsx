import useUrlState from "@ahooksjs/use-url-state";
import React from "react";





export default function Search({ placeholder }: { placeholder: string }){
  const [keyword, setKeyword] = useUrlState({keyword:""});
  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; })=> {
    setKeyword({keyword:e.target.value});
  };
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleInputChange}
      />
      
    </div>
  );
}