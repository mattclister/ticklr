export type TimeZone = {
    "TimeZoneCode": string,
    "TimeZone": string,
    "UTCText": string,
    "UTCNumber": Number
}

// Time Formating Function: Splits UTC into object of strings {year: monrh: day:}
export const formatedDate = (utcDateTime: string)=> {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const [datePart] = utcDateTime.split('T');
  const [year, month, day] = datePart.split('-');
  const monthTxt = months[parseInt(month)-1]
  return {day, month, year, monthTxt}
}


// When adding a new TimeZone, you must also add a new TimeZone Code to the timeZoneCodesArray. This is to enable z.enum to function correctly.

export const TimeZones: TimeZone[] = 
    [
        {
          "TimeZoneCode": "BIT",
          "TimeZone": "Baker Island Time",
          "UTCText": "UTC-12",
          "UTCNumber": -12
        },
        {
          "TimeZoneCode": "SST",
          "TimeZone": "Samoa Standard Time",
          "UTCText": "UTC-11",
          "UTCNumber": -11
        },
        {
          "TimeZoneCode": "HAST",
          "TimeZone": "Hawaii-Aleutian Standard Time",
          "UTCText": "UTC-10",
          "UTCNumber": -10
        },
        {
          "TimeZoneCode": "CKT",
          "TimeZone": "Cook Island Time",
          "UTCText": "UTC-10",
          "UTCNumber": -10
        },
        {
          "TimeZoneCode": "TAHT",
          "TimeZone": "Tahiti Time",
          "UTCText": "UTC-10",
          "UTCNumber": -10
        },
        {
          "TimeZoneCode": "MIT",
          "TimeZone": "Marquesas Islands Time",
          "UTCText": "UTC-09:30",
          "UTCNumber": -9.5
        },
        {
          "TimeZoneCode": "GIT",
          "TimeZone": "Gambier Island Time",
          "UTCText": "UTC-09",
          "UTCNumber": -9
        },
        {
          "TimeZoneCode": "AKST",
          "TimeZone": "Alaska Standard Time",
          "UTCText": "UTC-09",
          "UTCNumber": -9
        },
        {
          "TimeZoneCode": "CIST",
          "TimeZone": "Clipperton Island Standard Time",
          "UTCText": "UTC-08",
          "UTCNumber": -8
        },
        {
          "TimeZoneCode": "PST",
          "TimeZone": "Pacific Standard Time (North America)",
          "UTCText": "UTC-08",
          "UTCNumber": -8
        },
        {
          "TimeZoneCode": "PDT",
          "TimeZone": "Pacific Daylight Time (North America)",
          "UTCText": "UTC-07",
          "UTCNumber": -7
        },
        {
          "TimeZoneCode": "MST",
          "TimeZone": "Mountain Standard Time (North America)",
          "UTCText": "UTC-07",
          "UTCNumber": -7
        },
        {
          "TimeZoneCode": "MDT",
          "TimeZone": "Mountain Daylight Time (North America)",
          "UTCText": "UTC-06",
          "UTCNumber": -6
        },
        {
          "TimeZoneCode": "CST",
          "TimeZone": "Central Standard Time (North America)",
          "UTCText": "UTC-06",
          "UTCNumber": -6
        },
        {
          "TimeZoneCode": "GALT",
          "TimeZone": "Galapagos Time",
          "UTCText": "UTC-06",
          "UTCNumber": -6
        },
        {
          "TimeZoneCode": "EAST",
          "TimeZone": "Easter Island Standard Time",
          "UTCText": "UTC-06",
          "UTCNumber": -6
        },
        {
          "TimeZoneCode": "EST",
          "TimeZone": "Eastern Standard Time (North America)",
          "UTCText": "UTC-05",
          "UTCNumber": -5
        },
        {
          "TimeZoneCode": "ECT",
          "TimeZone": "Ecuador Time",
          "UTCText": "UTC-05",
          "UTCNumber": -5
        },
        {
          "TimeZoneCode": "COT",
          "TimeZone": "Colombia Time",
          "UTCText": "UTC-05",
          "UTCNumber": -5
        },
        {
          "TimeZoneCode": "CDT",
          "TimeZone": "Central Daylight Time (North America)",
          "UTCText": "UTC-05",
          "UTCNumber": -5
        },
        {
          "TimeZoneCode": "VET",
          "TimeZone": "Venezuelan Standard Time",
          "UTCText": "UTC-04:30",
          "UTCNumber": -4.5
        },
        {
          "TimeZoneCode": "ECT",
          "TimeZone": "Eastern Caribbean Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "EDT",
          "TimeZone": "Eastern Daylight Time (North America)",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "AST",
          "TimeZone": "Atlantic Standard Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "GYT",
          "TimeZone": "Guyana Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "FKST",
          "TimeZone": "Falkland Islands Standard Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "BOT",
          "TimeZone": "Bolivia Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "COST",
          "TimeZone": "Colombia Summer Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "CLT",
          "TimeZone": "Chile Standard Time",
          "UTCText": "UTC-04",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "NT",
          "TimeZone": "Newfoundland Time",
          "UTCText": "UTC-03:30",
          "UTCNumber": -3.5
        },
        {
          "TimeZoneCode": "UYT",
          "TimeZone": "Uruguay Standard Time",
          "UTCText": "UTC-03",
          "UTCNumber": -3
        },
        {
          "TimeZoneCode": "CLST",
          "TimeZone": "Chile Summer Time",
          "UTCText": "UTC-03",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "ART",
          "TimeZone": "Argentina Time",
          "UTCText": "UTC-03",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "BRT",
          "TimeZone": "Brasilia Time",
          "UTCText": "UTC-03",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "GFT",
          "TimeZone": "French Guiana Time",
          "UTCText": "UTC-03",
          "UTCNumber": -4
        },
        {
          "TimeZoneCode": "NDT",
          "TimeZone": "Newfoundland Daylight Time",
          "UTCText": "UTC-02:30",
          "UTCNumber": -2.5
        },
        {
          "TimeZoneCode": "UYST",
          "TimeZone": "Uruguay Summer Time",
          "UTCText": "UTC-02",
          "UTCNumber": -2
        },
        {
          "TimeZoneCode": "GST",
          "TimeZone": "South Georgia & South Sandwich Islands",
          "UTCText": "UTC-02",
          "UTCNumber": -2
        },
        {
          "TimeZoneCode": "CVT",
          "TimeZone": "Cape Verde Time",
          "UTCText": "UTC-01",
          "UTCNumber": -1
        },
        {
          "TimeZoneCode": "AZOST",
          "TimeZone": "Azores Standard Time",
          "UTCText": "UTC-01",
          "UTCNumber": -1
        },
        {
          "TimeZoneCode": "UTC",
          "TimeZone": "Coordinated Universal Time",
          "UTCText": "UTC",
          "UTCNumber": 0
        },
        {
          "TimeZoneCode": "WET",
          "TimeZone": "Western European Time",
          "UTCText": "UTC",
          "UTCNumber": 0
        },
        {
          "TimeZoneCode": "GMT",
          "TimeZone": "Greenwich Mean Time",
          "UTCText": "UTC",
          "UTCNumber": 0
        },
        {
          "TimeZoneCode": "WAT",
          "TimeZone": "West Africa Time",
          "UTCText": "UTC+01",
          "UTCNumber": 1
        },
        {
          "TimeZoneCode": "CET",
          "TimeZone": "Central European Time",
          "UTCText": "UTC+01",
          "UTCNumber": 1
        },
        {
          "TimeZoneCode": "BST",
          "TimeZone": "British Summer Time",
          "UTCText": "UTC+01",
          "UTCNumber": 1
        },
        {
          "TimeZoneCode": "WEST",
          "TimeZone": "Western European Summer Time",
          "UTCText": "UTC+01",
          "UTCNumber": 1
        },
        {
          "TimeZoneCode": "MEZ",
          "TimeZone": "Mitteleuropaische Zeit (German)",
          "UTCText": "UTC+01",
          "UTCNumber": 1
        },
        {
          "TimeZoneCode": "GTB",
          "TimeZone": "GTB Standard Time (Greece, Turkey, Bulgaria)",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "IST",
          "TimeZone": "Israel Standard Time",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "FLE",
          "TimeZone": "FLE Standard Time (Finland, Lithuania, Estonia)",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "SAST",
          "TimeZone": "South African Standard Time",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "CAT",
          "TimeZone": "Central Africa Time",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "EET",
          "TimeZone": "Eastern European Time",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "CEST",
          "TimeZone": "Central European Summer Time",
          "UTCText": "UTC+02",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "AST",
          "TimeZone": "Arabic Standard Time (Baghdad)",
          "UTCText": "UTC+03",
          "UTCNumber": 2
        },
        {
          "TimeZoneCode": "MSK",
          "TimeZone": "Moscow Standard Time",
          "UTCText": "UTC+03",
          "UTCNumber": 3
        },
        {
          "TimeZoneCode": "EAT",
          "TimeZone": "East Africa Time",
          "UTCText": "UTC+03",
          "UTCNumber": 3
        },
        {
          "TimeZoneCode": "AST",
          "TimeZone": "Arab Standard Time (Kuwait, Riyadh)",
          "UTCText": "UTC+03",
          "UTCNumber": 3
        },
        {
          "TimeZoneCode": "EEST",
          "TimeZone": "Eastern European Summer Time",
          "UTCText": "UTC+03",
          "UTCNumber": 3
        },
        {
          "TimeZoneCode": "IRST",
          "TimeZone": "Iran Standard Time",
          "UTCText": "UTC+03:30",
          "UTCNumber": 3.5
        },
        {
          "TimeZoneCode": "AMT",
          "TimeZone": "Armenia Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "AST",
          "TimeZone": "Arabian Standard Time (Abu Dhabi, Muscat)",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "MUT",
          "TimeZone": "Mauritius Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "SCT",
          "TimeZone": "Seychelles Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "RET",
          "TimeZone": "Reunion Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "SAMT",
          "TimeZone": "Samara Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "AZT",
          "TimeZone": "Azerbaijan Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "GET",
          "TimeZone": "Georgia Standard Time",
          "UTCText": "UTC+04",
          "UTCNumber": 4
        },
        {
          "TimeZoneCode": "AFT",
          "TimeZone": "Afghanistan Time",
          "UTCText": "UTC+04:30",
          "UTCNumber": 4.5
        },
        {
          "TimeZoneCode": "AMST",
          "TimeZone": "Armenia Summer Time",
          "UTCText": "UTC+05",
          "UTCNumber": 5
        },
        {
          "TimeZoneCode": "PKT",
          "TimeZone": "Pakistan Standard Time",
          "UTCText": "UTC+05",
          "UTCNumber": 5
        },
        {
          "TimeZoneCode": "HMT",
          "TimeZone": "Heard and McDonald Islands Time",
          "UTCText": "UTC+05",
          "UTCNumber": 5
        },
        {
          "TimeZoneCode": "YEKT",
          "TimeZone": "Yekaterinburg Time",
          "UTCText": "UTC+05",
          "UTCNumber": 5
        },
        {
          "TimeZoneCode": "SLT",
          "TimeZone": "Sri Lanka Time",
          "UTCText": "UTC+05:30",
          "UTCNumber": 5.5
        },
        {
          "TimeZoneCode": "IST",
          "TimeZone": "Indian Standard Time",
          "UTCText": "UTC+05:30",
          "UTCNumber": 5.5
        },
        {
          "TimeZoneCode": "NPT",
          "TimeZone": "Nepal Time",
          "UTCText": "UTC+05:45",
          "UTCNumber": 5.75
        },
        {
          "TimeZoneCode": "OMST",
          "TimeZone": "Omsk Time",
          "UTCText": "UTC+06",
          "UTCNumber": 6
        },
        {
          "TimeZoneCode": "BIOT",
          "TimeZone": "British Indian Ocean Time",
          "UTCText": "UTC+06",
          "UTCNumber": 6
        },
        {
          "TimeZoneCode": "BST",
          "TimeZone": "Bangladesh Standard Time",
          "UTCText": "UTC+06",
          "UTCNumber": 6
        },
        {
          "TimeZoneCode": "BTT",
          "TimeZone": "Bhutan Time",
          "UTCText": "UTC+06",
          "UTCNumber": 6
        },
        {
          "TimeZoneCode": "MST",
          "TimeZone": "Myanmar Standard Time",
          "UTCText": "UTC+06:30",
          "UTCNumber": 6.5
        },
        {
          "TimeZoneCode": "CCT",
          "TimeZone": "Cocos Islands Time",
          "UTCText": "UTC+06:30",
          "UTCNumber": 6.5
        },
        {
          "TimeZoneCode": "THA",
          "TimeZone": "Thailand Standard Time",
          "UTCText": "UTC+07",
          "UTCNumber": 7
        },
        {
          "TimeZoneCode": "CXT",
          "TimeZone": "Christmas Island Time",
          "UTCText": "UTC+07",
          "UTCNumber": 7
        },
        {
          "TimeZoneCode": "KRAT",
          "TimeZone": "Krasnoyarsk Time",
          "UTCText": "UTC+07",
          "UTCNumber": 7
        },
        {
          "TimeZoneCode": "MST",
          "TimeZone": "Malaysian Standard Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "IRKT",
          "TimeZone": "Irkutsk Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "ACT",
          "TimeZone": "ASEAN Common Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "HKT",
          "TimeZone": "Hong Kong Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "AWST",
          "TimeZone": "Australian Western Standard Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "PST",
          "TimeZone": "Philippine Standard Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "CST",
          "TimeZone": "China Standard Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "BDT",
          "TimeZone": "Brunei Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "SST",
          "TimeZone": "Singapore Standard Time",
          "UTCText": "UTC+08",
          "UTCNumber": 8
        },
        {
          "TimeZoneCode": "YAKT",
          "TimeZone": "Yakutsk Time",
          "UTCText": "UTC+09",
          "UTCNumber": 9
        },
        {
          "TimeZoneCode": "JST",
          "TimeZone": "Japan Standard Time",
          "UTCText": "UTC+09",
          "UTCNumber": 9
        },
        {
          "TimeZoneCode": "KST",
          "TimeZone": "Korea Standard Time",
          "UTCText": "UTC+09",
          "UTCNumber": 9
        },
        {
          "TimeZoneCode": "ACST",
          "TimeZone": "Australian Central Standard Time",
          "UTCText": "UTC+09:30",
          "UTCNumber": 9.5
        },
        {
          "TimeZoneCode": "ChST",
          "TimeZone": "Chamorro Standard Time",
          "UTCText": "UTC+10",
          "UTCNumber": 10
        },
        {
          "TimeZoneCode": "VLAT",
          "TimeZone": "Vladivostok Time",
          "UTCText": "UTC+10",
          "UTCNumber": 10
        },
        {
          "TimeZoneCode": "AEST",
          "TimeZone": "Australian Eastern Standard Time",
          "UTCText": "UTC+10",
          "UTCNumber": 10
        },
        {
          "TimeZoneCode": "LHST",
          "TimeZone": "Lord Howe Standard Time",
          "UTCText": "UTC+10:30",
          "UTCNumber": 10.5
        },
        {
          "TimeZoneCode": "MAGT",
          "TimeZone": "Magadan Time",
          "UTCText": "UTC+11",
          "UTCNumber": 11
        },
        {
          "TimeZoneCode": "SBT",
          "TimeZone": "Solomon Islands Time",
          "UTCText": "UTC+11",
          "UTCNumber": 11
        },
        {
          "TimeZoneCode": "NFT",
          "TimeZone": "Norfolk Island Time",
          "UTCText": "UTC+11:30",
          "UTCNumber": 11.5
        },
        {
          "TimeZoneCode": "FJT",
          "TimeZone": "Fiji Time",
          "UTCText": "UTC+12",
          "UTCNumber": 12
        },
        {
          "TimeZoneCode": "PETT",
          "TimeZone": "Kamchatka Time",
          "UTCText": "UTC+12",
          "UTCNumber": 12
        },
        {
          "TimeZoneCode": "GILT",
          "TimeZone": "Gilbert Island Time",
          "UTCText": "UTC+12",
          "UTCNumber": 12
        },
        {
          "TimeZoneCode": "CHAST",
          "TimeZone": "Chatham Standard Time",
          "UTCText": "UTC+12:45",
          "UTCNumber": 12.75
        },
        {
          "TimeZoneCode": "PHOT",
          "TimeZone": "Phoenix Island Time",
          "UTCText": "UTC+13",
          "UTCNumber": 13
        },
        {
          "TimeZoneCode": "LINT",
          "TimeZone": "Line Islands Time",
          "UTCText": "UTC+14",
          "UTCNumber": 14
        }
       ]

export const timeZoneCodesArray = 
[
  "BIT",
  "SST",
  "HAST",
  "CKT",
  "TAHT",
  "MIT",
  "GIT",
  "AKST",
  "CIST",
  "PST",
  "PDT",
  "MST",
  "MDT",
  "CST",
  "GALT",
  "EAST",
  "EST",
  "ECT",
  "COT",
  "CDT",
  "VET",
  "ECT",
  "EDT",
  "AST",
  "GYT",
  "FKST",
  "BOT",
  "COST",
  "CLT",
  "NT",
  "UYT",
  "CLST",
  "ART",
  "BRT",
  "GFT",
  "NDT",
  "UYST",
  "GST",
  "CVT",
  "AZOST",
  "UTC",
  "WET",
  "GMT",
  "WAT",
  "CET",
  "BST",
  "WEST",
  "MEZ",
  "GTB",
  "IST",
  "FLE",
  "SAST",
  "CAT",
  "EET",
  "CEST",
  "AST",
  "MSK",
  "EAT",
  "AST",
  "EEST",
  "IRST",
  "AMT",
  "AST",
  "MUT",
  "SCT",
  "RET",
  "SAMT",
  "AZT",
  "GET",
  "AFT",
  "AMST",
  "PKT",
  "HMT",
  "YEKT",
  "SLT",
  "IST",
  "NPT",
  "OMST",
  "BIOT",
  "BST",
  "BTT",
  "MST",
  "CCT",
  "THA",
  "CXT",
  "KRAT",
  "MST",
  "IRKT",
  "ACT",
  "HKT",
  "AWST",
  "PST",
  "CST",
  "BDT",
  "SST",
  "YAKT",
  "JST",
  "KST",
  "ACST",
  "ChST",
  "VLAT",
  "AEST",
  "LHST",
  "MAGT",
  "SBT",
  "NFT",
  "FJT",
  "PETT",
  "GILT",
  "CHAST",
  "PHOT",
  "LINT"
] as const;