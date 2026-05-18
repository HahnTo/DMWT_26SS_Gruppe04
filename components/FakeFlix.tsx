interface FakeflixProps {
  img: string;
}

export default function Fakeflix({ img }: FakeflixProps){
  return(
    <div className="min-h-screen p-4 flex">
      <div className="flex-1 bg-gray-400 rounded-xl">
        <img src={img} alt="Fakeflix" className="w-full h-full object-cover rounded-xl" />
      </div>
    </div>
  );
}