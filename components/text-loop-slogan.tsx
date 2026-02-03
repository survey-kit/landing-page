import { TextLoop } from "@/components/ui/text-loop"

export function TextLoopSlogan() {
  return (
    <div className="text-2xl mx-auto md:text-4xl text-foreground text-balance text-center font-bold flex flex-col items-center">
      <span className="inline-block">A survey framework for</span>
      <span className="block md:inline-block md:ml-2">
        <TextLoop
          className="inline-block"
          transition={{ type: "spring", stiffness: 900, damping: 80, mass: 10 }}
          variants={{
            initial: { y: 40, rotateX: 90, opacity: 0, filter: "blur(8px)" },
            animate: {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
            },
            exit: {
              y: -20,
              rotateX: -90,
              opacity: 0,
              filter: "blur(8px)",
            },
          }}
        >
          <span>mobile</span>
          <span>accessiblity</span>
          <span>developers</span>
          <span>flexibility</span>
          <span>extensibility</span>
        </TextLoop>
      </span>
    </div>
  )
}
