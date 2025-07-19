const generateComplaintText = (type, data) => {
  const { fullName, incidentDate, incidentLink, description, contactInfo } = data;

  const baseInfo = `
To whom it may concern,

I, ${fullName}, wish to file a formal complaint regarding an incident that occurred on ${incidentDate}. The content can be found at the following link:

${incidentLink}

${description}

Below is my contact information for further communication:
${contactInfo}
`;

  switch (type) {
    case "harassment":
      return `${baseInfo}

The material in question constitutes targeted online harassment and has caused me significant distress. I request that appropriate action be taken immediately to remove the content and prevent further harm.

Sincerely,
${fullName}`;

    case "impersonation":
      return `${baseInfo}

The link provided leads to a profile or post that is impersonating me and misusing my identity without consent. This poses a serious risk to my reputation and safety. Kindly take immediate action to remove the fake content.

Thank you,
${fullName}`;

    case "nonconsensual":
      return `${baseInfo}

The link above contains content that has been shared without my consent. This is a violation of my privacy and dignity. I request an urgent takedown and further investigation.

With regards,
${fullName}`;

    case "cyberbullying":
      return `${baseInfo}

The incident described involves cyberbullying, including threats or abusive behavior. This is deeply troubling and has affected my mental well-being. I request that the platform take strict action against such behavior.

Sincerely,
${fullName}`;

    default:
      return `${baseInfo}

This complaint pertains to misuse or abuse of content related to me. I respectfully request review and necessary action as per your guidelines.

Regards,
${fullName}`;
  }
};

export default generateComplaintText;
