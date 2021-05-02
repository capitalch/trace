import { env } from "process";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import "./component4.scss";
import moment from "moment";
import { Button } from "@material-ui/core";

const Component4 = () => {
  const [, setRefresh] = useState({});

  useEffect(() => {
    // fillQuarters();
  });

  const quarters = {
    1: {
      startDate: undefined,
      endDate: undefined,
      startMonth: 0,
      endMonth: 0,
    },
    2: {
      startDate: undefined,
      endDate: undefined,
      startMonth: 0,
      endMonth: 0,
    },
    3: {
      startDate: undefined,
      endDate: undefined,
      startMonth: 0,
      endMonth: 0,
    },
    4: {
      startDate: undefined,
      endDate: undefined,
      startMonth: 0,
      endMonth: 0,
    },
  };

  return (
    <div>
      <Button
        onClick={(e: any) => {
          getQtrRange(1);
          getQtrRange(2);
          getQtrRange(3);
          getQtrRange(4);
        }}
      >
        Test
      </Button>
    </div>
  );

  function getQtrRange(qtr: number) {
    const size = 3;
    const monthYear = getstartMonthYear(qtr, size)
    const endMonth = monthYear.month + (size - 1)
    
    const startEndDate:any = {
      startDate: moment([monthYear.year, monthYear.month - 1]).startOf('month').format('YYYY-MM-DD'), // Moment month is zero based, so compensate
      endDate: moment([monthYear.year, endMonth - 1]).endOf('month').format('YYYY-MM-DD')
    }

    function getstartMonthYear(qtr: number, size: number) {
      const baseDate = "2021-04-01";
      const baseMonth = +moment(baseDate).format("MM");
      let tempYear = +moment(baseDate).format("YYYY");
      
      let tempMonth = baseMonth + size * (qtr - 1);
      if (tempMonth > 12) {
        tempMonth = tempMonth - 12;
        tempYear++;
      }
      return { month: tempMonth, year: tempYear };
    }
  }
};

export { Component4 };
