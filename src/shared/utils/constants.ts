const shortNavigation = {
  profile: "profile",
  feed: "feed",
  short: "short",
  search: "search",
};
const server_add_card = {
  addCard: "added",
  notStripe: "no_stripe_account",
  alreadyStripe: "already_card",
};
const notificationType = {
  new_short: "new_short",
  commented_short: "commented_on_short",
  new_stream: "new_stream",
  follow_streamer: "follow_streamer",
  donation: "sent_donation",
  liked: "video_liked",
};
const packageConstant = {
  basic: 0,
  standard: 1,
  premium: 2,
};
const packageTypeConstant = {
  basic: "Basic",
  basicDesc: "For 1 month",
  standard: "Standard",
  standDesc: "For 6 months",
  premium: "Premium",
  Premdesc: "For 12 months",
};
const delType = {
  short: "short",
  stream: "stream",
};
const shortReaction = {
  views: 0,
  like: 1,
  share: 2,
};

const streamReaction = {
  views: 0,
  like: 1,
  share: 2,
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "most_recent", label: "Most Recent" },
  { value: "most_viewed", label: "Most Viewed" },
  { value: "most_liked", label: "Most Liked" },
  { value: "a-z", label: "Ascending A-Z" },
  { value: "z-a", label: "Descending Z-A" },
];

const CommentFilters = [
  { value: "all", label: "All" },
  { value: "newest-first", label: "Newest First" },
  { value: "oldest-first", label: "Oldest First" },
];

const cardDropDownOptions: {
  cardTitle: string;
}[] = [
  {
    cardTitle: "Set as Default",
  },
  {
    cardTitle: "Remove Card",
  },
];
const cmntDropDownOptions: {
  cmntTitle: string;
}[] = [
  {
    cmntTitle: "Edit",
  },
  {
    cmntTitle: "Delete",
  },
];

const plans: {
  name: string;
  price: number;
  desc: string;
}[] = [
  {
    name: "Basic",
    price: 12,
    desc: "For 1 month",
  },
  {
    name: "Standard",
    price: 24,
    desc: "For 6 months",
  },
  {
    name: "Premium",
    price: 36,
    desc: "For 12 months",
  },
];

const table_Heading: { heading: string }[] = [
  {
    heading: "Streamer",
  },
  {
    heading: "Amount",
  },
  {
    heading: "Billing Date",
  },
  {
    heading: "Plan",
  },
  {
    heading: "Status",
  },
  {
    heading: "Action",
  },
];
const table_donation_Heading: { heading: string }[] = [
  {
    heading: "Streamer",
  },
  {
    heading: "Amount",
  },
  {
    heading: "Date",
  },
  {
    heading: "Status",
  },
  {
    heading: "Action",
  },
];

export {
  shortNavigation,
  filterOptions,
  plans,
  CommentFilters,
  table_Heading,
  cardDropDownOptions,
  table_donation_Heading,
  cmntDropDownOptions,
  shortReaction,
  delType,
  packageConstant,
  packageTypeConstant,
  notificationType,
  streamReaction,
  server_add_card,
};
