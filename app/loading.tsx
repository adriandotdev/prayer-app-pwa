import { Loader } from "@/components/brand/loader";

export default function Loading() {
  return (
    <div className="ora-fade [animation-delay:150ms]">
      <Loader />
    </div>
  );
}
