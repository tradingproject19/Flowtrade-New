export const SupportedResolutions = [
  "1T",
  "1S",
  "1",
  "2",
  "3",
  "5",
  "15",
  "30",
  "45", // Minutes
  "60",
  "120",
  "180",
  "240", // Hours
  "1D", // Days
  "3D", // Days
  "1W", // Weeks
  // "1M",
  // "3M",
  // "6M",
  // "12M", // Months
];

export const resolutionMapping: Record<string, [string, string]> = {
  "1T": ["1000", "tick"],
  "1S": ["1", "second"],
  "1": ["1", "minute"],
  "2": ["2", "minute"],
  "3": ["3", "minute"],
  "5": ["5", "minute"],
  "15": ["15", "minute"],
  "30": ["30", "minute"],
  "45": ["45", "minute"],
  "60": ["1", "hour"],
  "120": ["2", "hour"],
  "180": ["3", "hour"],
  "240": ["4", "hour"],
  "1D": ["1", "day"],
  "1W": ["1", "week"],
  "1M": ["1", "month"],
  "3M": ["3", "month"],
  "6M": ["6", "month"],
  "12M": ["12", "month"],
};
