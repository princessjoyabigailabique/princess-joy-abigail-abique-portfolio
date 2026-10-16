import Image from "next/image";

type AbiqueMarkProps = { size?: number; className?: string; priority?: boolean };

/** Brand mark using Abigail's existing crystal A emblem, with a restrained orbit detail. */
export default function AbiqueMark({ size = 36, className = "", priority = false }: AbiqueMarkProps) {
  return (
    <span className={`abique-mark ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <Image src="/images/abique-emblem.png" alt="" width={size} height={size} priority={priority} className="abique-mark-image" />
      <span className="abique-mark-orbit" />
      <span className="abique-mark-star abique-mark-star-one" />
      <span className="abique-mark-star abique-mark-star-two" />
    </span>
  );
}
