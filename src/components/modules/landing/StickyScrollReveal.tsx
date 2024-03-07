"use client";

import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const content = [
  {
    title: "Website Builder",
    description: (
      <>
        <p>
          The Website Builder for Agency CRM is a powerful tool designed to
          streamline the process of creating and managing websites for agencies.
        </p>
        <p>
          With its intuitive interface and robust features, agencies can easily
          build custom websites tailored to their clients&apos; needs without
          extensive coding knowledge.
        </p>
        <p>
          From drag-and-drop functionality to seamless integration with CRM
          systems, this tool empowers agencies to deliver stunning websites
          efficiently and effectively, ultimately enhancing client satisfaction
          and driving business growth.
        </p>
      </>
    ),
    content: (
      <div className="h-full w-full rounded-md flex items-center justify-center text-white">
        <Image
          src="https://utfs.io/f/30845fe9-f07d-49a4-8072-112bb8152111-euyk0.png"
          fill
          className="h-full w-full object-fit rounded-md border"
          alt="Feature"
        />
      </div>
    ),
  },
  {
    title: "Kanban Board",
    description: (
      <>
        <p>
          The Kanban Board for pipelines in Agency CRM offers a visual and
          efficient way for agencies to manage their projects and workflows.
        </p>
        <p>
          By organizing tasks into customizable pipelines, agencies can easily
          track the progress of projects from start to finish.
        </p>
        <p>
          With features like drag-and-drop functionality and customizable
          columns, this tool enables teams to prioritize tasks, collaborate
          effectively, and stay organized, ultimately improving productivity and
          project delivery.
        </p>
      </>
    ),
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="https://utfs.io/f/76fb5e37-fa30-46e2-94c7-d664b516a67f-mc721d.png"
          fill
          className="h-full w-full object-fit rounded-md border"
          alt="Feature"
        />
      </div>
    ),
  },
  {
    title: "Team Access",
    description: (
      <>
        <p>
          Team Access for Agency CRM provides secure and seamless access control
          for agency teams, ensuring efficient collaboration and data
          management.
        </p>
        <p>
          With customizable user permissions, agencies can easily tailor access
          levels to match individual roles and responsibilities.
        </p>
        <p>
          This feature enhances teamwork by allowing team members to access the
          necessary information while maintaining data security and
          confidentiality, ultimately optimizing workflow efficiency and
          productivity.
        </p>
      </>
    ),
    content: (
      <div className="h-full w-full rounded-md flex items-center justify-center text-white">
        <Image
          src="https://utfs.io/f/9645dd80-d15c-418f-93ae-c1f329cc5ebb-1tmp4m.png"
          fill
          className="h-full w-full object-fit rounded-md border"
          alt="Feature"
        />
      </div>
    ),
  },
  {
    title: "Leads Dashboard",
    description: (
      <>
        <p>
          The Leads Dashboard for Agency CRM offers a comprehensive overview of
          potential opportunities and client interactions, empowering agencies
          to effectively manage their sales pipeline.
        </p>
        <p>
          With real-time updates and customizable filters, agencies can track
          leads, prioritize follow-ups, and analyze conversion rates with ease.
        </p>
        <p>
          This feature enhances sales performance by providing actionable
          insights, enabling agencies to make informed decisions and drive
          business growth.
        </p>
      </>
    ),
    content: (
      <div className="h-full w-full rounded-md flex items-center justify-center text-white">
        <Image
          src="/assets/preview.png"
          fill
          className="h-full w-full object-fit rounded-md border"
          alt="Feature"
        />
      </div>
    ),
  },
];

export const StickyScroll = ({
  contentClassName,
}: {
  contentClassName?: string | React.ReactNode;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    target: ref,
    // container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <motion.div
      className="flex justify-center relative space-x-10 rounded-md p-10 pb-0"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-5xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="mb-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="max-w-md mt-4 space-y-2"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        className={cn(
          "hidden lg:block max-w-2xl h-[358px] rounded-md w-full sticky top-10",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};
