import React from "react";

interface AgencyIdPageProps {
  params: {
    agencyId: string | undefined;
  };
}

const AgencyIdPage: React.FC<AgencyIdPageProps> = ({ params }) => {
  return <div>{params.agencyId}</div>;
};

export default AgencyIdPage;
