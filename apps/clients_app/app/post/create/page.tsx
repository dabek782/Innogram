import CreatePostForm from "@/components/forms/createPostForm";

export default function CreatePost() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 m-3  flex flex-col justify-center items-center w-full max-w-sm md:w-96 border border-gray-200 ">
        <h1 className="text-3xl shadow-4xl text-center font-bold mb-3  ">
          Create post
        </h1>
        <CreatePostForm />
      </div>
    </div>
  );
}
