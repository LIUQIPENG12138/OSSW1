/**
 * DU-FLEX 7주차 실습 3: 가상의 동네 카페 매출 대시보드 데이터 (data.js)
 * 30일 x 메뉴 5종 판매량 및 매출 가상 데이터
 * 총매출 합계: 28,273,600원
 */

const CAFE_INFO = {
  name: "달빛 블렌드 카페 (Moonlight Blend Cafe)",
  name_zh: "月光漫步社区咖啡店",
  period: "2026.10.01 ~ 2026.10.30 (30일간)",
  currency: "KRW (원 / 韩元)"
};

const CAFE_MENUS = [
  {
    "id": "m1",
    "name": "아메리카노 (Americano)",
    "name_zh": "美式咖啡",
    "price": 4000,
    "color": "#0284c7"
  },
  {
    "id": "m2",
    "name": "카페라떼 (Cafe Latte)",
    "name_zh": "拿铁咖啡",
    "price": 4800,
    "color": "#f97316"
  },
  {
    "id": "m3",
    "name": "바닐라빈라떼 (Vanilla Bean Latte)",
    "name_zh": "香草拿铁",
    "price": 5300,
    "color": "#eab308"
  },
  {
    "id": "m4",
    "name": "딸기스무디 (Strawberry Smoothie)",
    "name_zh": "草莓冰沙",
    "price": 5800,
    "color": "#ec4899"
  },
  {
    "id": "m5",
    "name": "당근케이크 (Carrot Cake)",
    "name_zh": "胡萝卜蛋糕",
    "price": 6500,
    "color": "#10b981"
  }
];

const DAILY_SALES_DATA = [
  {
    "day": 1,
    "date": "2026-10-01",
    "weekday_kr": "목",
    "weekday_zh": "周四",
    "weekday_idx": 3,
    "sales": {
      "m1": {
        "volume": 74,
        "revenue": 296000
      },
      "m2": {
        "volume": 37,
        "revenue": 177600
      },
      "m3": {
        "volume": 21,
        "revenue": 111300
      },
      "m4": {
        "volume": 27,
        "revenue": 156600
      },
      "m5": {
        "volume": 18,
        "revenue": 117000
      }
    },
    "day_revenue": 858500
  },
  {
    "day": 2,
    "date": "2026-10-02",
    "weekday_kr": "금",
    "weekday_zh": "周五",
    "weekday_idx": 4,
    "sales": {
      "m1": {
        "volume": 56,
        "revenue": 224000
      },
      "m2": {
        "volume": 47,
        "revenue": 225600
      },
      "m3": {
        "volume": 24,
        "revenue": 127200
      },
      "m4": {
        "volume": 20,
        "revenue": 116000
      },
      "m5": {
        "volume": 11,
        "revenue": 71500
      }
    },
    "day_revenue": 764300
  },
  {
    "day": 3,
    "date": "2026-10-03",
    "weekday_kr": "토",
    "weekday_zh": "周六",
    "weekday_idx": 5,
    "sales": {
      "m1": {
        "volume": 98,
        "revenue": 392000
      },
      "m2": {
        "volume": 54,
        "revenue": 259200
      },
      "m3": {
        "volume": 45,
        "revenue": 238500
      },
      "m4": {
        "volume": 39,
        "revenue": 226200
      },
      "m5": {
        "volume": 27,
        "revenue": 175500
      }
    },
    "day_revenue": 1291400
  },
  {
    "day": 4,
    "date": "2026-10-04",
    "weekday_kr": "일",
    "weekday_zh": "周日",
    "weekday_idx": 6,
    "sales": {
      "m1": {
        "volume": 74,
        "revenue": 296000
      },
      "m2": {
        "volume": 53,
        "revenue": 254400
      },
      "m3": {
        "volume": 43,
        "revenue": 227900
      },
      "m4": {
        "volume": 32,
        "revenue": 185600
      },
      "m5": {
        "volume": 20,
        "revenue": 130000
      }
    },
    "day_revenue": 1093900
  },
  {
    "day": 5,
    "date": "2026-10-05",
    "weekday_kr": "월",
    "weekday_zh": "周一",
    "weekday_idx": 0,
    "sales": {
      "m1": {
        "volume": 59,
        "revenue": 236000
      },
      "m2": {
        "volume": 47,
        "revenue": 225600
      },
      "m3": {
        "volume": 21,
        "revenue": 111300
      },
      "m4": {
        "volume": 24,
        "revenue": 139200
      },
      "m5": {
        "volume": 19,
        "revenue": 123500
      }
    },
    "day_revenue": 835600
  },
  {
    "day": 6,
    "date": "2026-10-06",
    "weekday_kr": "화",
    "weekday_zh": "周二",
    "weekday_idx": 1,
    "sales": {
      "m1": {
        "volume": 60,
        "revenue": 240000
      },
      "m2": {
        "volume": 47,
        "revenue": 225600
      },
      "m3": {
        "volume": 25,
        "revenue": 132500
      },
      "m4": {
        "volume": 25,
        "revenue": 145000
      },
      "m5": {
        "volume": 14,
        "revenue": 91000
      }
    },
    "day_revenue": 834100
  },
  {
    "day": 7,
    "date": "2026-10-07",
    "weekday_kr": "수",
    "weekday_zh": "周三",
    "weekday_idx": 2,
    "sales": {
      "m1": {
        "volume": 55,
        "revenue": 220000
      },
      "m2": {
        "volume": 40,
        "revenue": 192000
      },
      "m3": {
        "volume": 35,
        "revenue": 185500
      },
      "m4": {
        "volume": 22,
        "revenue": 127600
      },
      "m5": {
        "volume": 14,
        "revenue": 91000
      }
    },
    "day_revenue": 816100
  },
  {
    "day": 8,
    "date": "2026-10-08",
    "weekday_kr": "목",
    "weekday_zh": "周四",
    "weekday_idx": 3,
    "sales": {
      "m1": {
        "volume": 74,
        "revenue": 296000
      },
      "m2": {
        "volume": 46,
        "revenue": 220800
      },
      "m3": {
        "volume": 22,
        "revenue": 116600
      },
      "m4": {
        "volume": 25,
        "revenue": 145000
      },
      "m5": {
        "volume": 16,
        "revenue": 104000
      }
    },
    "day_revenue": 882400
  },
  {
    "day": 9,
    "date": "2026-10-09",
    "weekday_kr": "금",
    "weekday_zh": "周五",
    "weekday_idx": 4,
    "sales": {
      "m1": {
        "volume": 72,
        "revenue": 288000
      },
      "m2": {
        "volume": 44,
        "revenue": 211200
      },
      "m3": {
        "volume": 23,
        "revenue": 121900
      },
      "m4": {
        "volume": 25,
        "revenue": 145000
      },
      "m5": {
        "volume": 16,
        "revenue": 104000
      }
    },
    "day_revenue": 870100
  },
  {
    "day": 10,
    "date": "2026-10-10",
    "weekday_kr": "토",
    "weekday_zh": "周六",
    "weekday_idx": 5,
    "sales": {
      "m1": {
        "volume": 83,
        "revenue": 332000
      },
      "m2": {
        "volume": 46,
        "revenue": 220800
      },
      "m3": {
        "volume": 44,
        "revenue": 233200
      },
      "m4": {
        "volume": 33,
        "revenue": 191400
      },
      "m5": {
        "volume": 24,
        "revenue": 156000
      }
    },
    "day_revenue": 1133400
  },
  {
    "day": 11,
    "date": "2026-10-11",
    "weekday_kr": "일",
    "weekday_zh": "周日",
    "weekday_idx": 6,
    "sales": {
      "m1": {
        "volume": 81,
        "revenue": 324000
      },
      "m2": {
        "volume": 67,
        "revenue": 321600
      },
      "m3": {
        "volume": 36,
        "revenue": 190800
      },
      "m4": {
        "volume": 36,
        "revenue": 208800
      },
      "m5": {
        "volume": 27,
        "revenue": 175500
      }
    },
    "day_revenue": 1220700
  },
  {
    "day": 12,
    "date": "2026-10-12",
    "weekday_kr": "월",
    "weekday_zh": "周一",
    "weekday_idx": 0,
    "sales": {
      "m1": {
        "volume": 74,
        "revenue": 296000
      },
      "m2": {
        "volume": 44,
        "revenue": 211200
      },
      "m3": {
        "volume": 33,
        "revenue": 174900
      },
      "m4": {
        "volume": 26,
        "revenue": 150800
      },
      "m5": {
        "volume": 17,
        "revenue": 110500
      }
    },
    "day_revenue": 943400
  },
  {
    "day": 13,
    "date": "2026-10-13",
    "weekday_kr": "화",
    "weekday_zh": "周二",
    "weekday_idx": 1,
    "sales": {
      "m1": {
        "volume": 69,
        "revenue": 276000
      },
      "m2": {
        "volume": 49,
        "revenue": 235200
      },
      "m3": {
        "volume": 22,
        "revenue": 116600
      },
      "m4": {
        "volume": 31,
        "revenue": 179800
      },
      "m5": {
        "volume": 14,
        "revenue": 91000
      }
    },
    "day_revenue": 898600
  },
  {
    "day": 14,
    "date": "2026-10-14",
    "weekday_kr": "수",
    "weekday_zh": "周三",
    "weekday_idx": 2,
    "sales": {
      "m1": {
        "volume": 59,
        "revenue": 236000
      },
      "m2": {
        "volume": 47,
        "revenue": 225600
      },
      "m3": {
        "volume": 30,
        "revenue": 159000
      },
      "m4": {
        "volume": 25,
        "revenue": 145000
      },
      "m5": {
        "volume": 17,
        "revenue": 110500
      }
    },
    "day_revenue": 876100
  },
  {
    "day": 15,
    "date": "2026-10-15",
    "weekday_kr": "목",
    "weekday_zh": "周四",
    "weekday_idx": 3,
    "sales": {
      "m1": {
        "volume": 70,
        "revenue": 280000
      },
      "m2": {
        "volume": 43,
        "revenue": 206400
      },
      "m3": {
        "volume": 35,
        "revenue": 185500
      },
      "m4": {
        "volume": 27,
        "revenue": 156600
      },
      "m5": {
        "volume": 18,
        "revenue": 117000
      }
    },
    "day_revenue": 945500
  },
  {
    "day": 16,
    "date": "2026-10-16",
    "weekday_kr": "금",
    "weekday_zh": "周五",
    "weekday_idx": 4,
    "sales": {
      "m1": {
        "volume": 57,
        "revenue": 228000
      },
      "m2": {
        "volume": 41,
        "revenue": 196800
      },
      "m3": {
        "volume": 30,
        "revenue": 159000
      },
      "m4": {
        "volume": 32,
        "revenue": 185600
      },
      "m5": {
        "volume": 16,
        "revenue": 104000
      }
    },
    "day_revenue": 873400
  },
  {
    "day": 17,
    "date": "2026-10-17",
    "weekday_kr": "토",
    "weekday_zh": "周六",
    "weekday_idx": 5,
    "sales": {
      "m1": {
        "volume": 84,
        "revenue": 336000
      },
      "m2": {
        "volume": 54,
        "revenue": 259200
      },
      "m3": {
        "volume": 34,
        "revenue": 180200
      },
      "m4": {
        "volume": 42,
        "revenue": 243600
      },
      "m5": {
        "volume": 18,
        "revenue": 117000
      }
    },
    "day_revenue": 1136000
  },
  {
    "day": 18,
    "date": "2026-10-18",
    "weekday_kr": "일",
    "weekday_zh": "周日",
    "weekday_idx": 6,
    "sales": {
      "m1": {
        "volume": 93,
        "revenue": 372000
      },
      "m2": {
        "volume": 45,
        "revenue": 216000
      },
      "m3": {
        "volume": 30,
        "revenue": 159000
      },
      "m4": {
        "volume": 33,
        "revenue": 191400
      },
      "m5": {
        "volume": 19,
        "revenue": 123500
      }
    },
    "day_revenue": 1061900
  },
  {
    "day": 19,
    "date": "2026-10-19",
    "weekday_kr": "월",
    "weekday_zh": "周一",
    "weekday_idx": 0,
    "sales": {
      "m1": {
        "volume": 56,
        "revenue": 224000
      },
      "m2": {
        "volume": 49,
        "revenue": 235200
      },
      "m3": {
        "volume": 36,
        "revenue": 190800
      },
      "m4": {
        "volume": 21,
        "revenue": 121800
      },
      "m5": {
        "volume": 19,
        "revenue": 123500
      }
    },
    "day_revenue": 895300
  },
  {
    "day": 20,
    "date": "2026-10-20",
    "weekday_kr": "화",
    "weekday_zh": "周二",
    "weekday_idx": 1,
    "sales": {
      "m1": {
        "volume": 63,
        "revenue": 252000
      },
      "m2": {
        "volume": 49,
        "revenue": 235200
      },
      "m3": {
        "volume": 25,
        "revenue": 132500
      },
      "m4": {
        "volume": 27,
        "revenue": 156600
      },
      "m5": {
        "volume": 17,
        "revenue": 110500
      }
    },
    "day_revenue": 886800
  },
  {
    "day": 21,
    "date": "2026-10-21",
    "weekday_kr": "수",
    "weekday_zh": "周三",
    "weekday_idx": 2,
    "sales": {
      "m1": {
        "volume": 69,
        "revenue": 276000
      },
      "m2": {
        "volume": 36,
        "revenue": 172800
      },
      "m3": {
        "volume": 27,
        "revenue": 143100
      },
      "m4": {
        "volume": 23,
        "revenue": 133400
      },
      "m5": {
        "volume": 12,
        "revenue": 78000
      }
    },
    "day_revenue": 803300
  },
  {
    "day": 22,
    "date": "2026-10-22",
    "weekday_kr": "목",
    "weekday_zh": "周四",
    "weekday_idx": 3,
    "sales": {
      "m1": {
        "volume": 71,
        "revenue": 284000
      },
      "m2": {
        "volume": 41,
        "revenue": 196800
      },
      "m3": {
        "volume": 20,
        "revenue": 106000
      },
      "m4": {
        "volume": 17,
        "revenue": 98600
      },
      "m5": {
        "volume": 22,
        "revenue": 143000
      }
    },
    "day_revenue": 828400
  },
  {
    "day": 23,
    "date": "2026-10-23",
    "weekday_kr": "금",
    "weekday_zh": "周五",
    "weekday_idx": 4,
    "sales": {
      "m1": {
        "volume": 56,
        "revenue": 224000
      },
      "m2": {
        "volume": 44,
        "revenue": 211200
      },
      "m3": {
        "volume": 25,
        "revenue": 132500
      },
      "m4": {
        "volume": 30,
        "revenue": 174000
      },
      "m5": {
        "volume": 21,
        "revenue": 136500
      }
    },
    "day_revenue": 878200
  },
  {
    "day": 24,
    "date": "2026-10-24",
    "weekday_kr": "토",
    "weekday_zh": "周六",
    "weekday_idx": 5,
    "sales": {
      "m1": {
        "volume": 93,
        "revenue": 372000
      },
      "m2": {
        "volume": 54,
        "revenue": 259200
      },
      "m3": {
        "volume": 43,
        "revenue": 227900
      },
      "m4": {
        "volume": 34,
        "revenue": 197200
      },
      "m5": {
        "volume": 24,
        "revenue": 156000
      }
    },
    "day_revenue": 1212300
  },
  {
    "day": 25,
    "date": "2026-10-25",
    "weekday_kr": "일",
    "weekday_zh": "周日",
    "weekday_idx": 6,
    "sales": {
      "m1": {
        "volume": 89,
        "revenue": 356000
      },
      "m2": {
        "volume": 62,
        "revenue": 297600
      },
      "m3": {
        "volume": 40,
        "revenue": 212000
      },
      "m4": {
        "volume": 39,
        "revenue": 226200
      },
      "m5": {
        "volume": 14,
        "revenue": 91000
      }
    },
    "day_revenue": 1182800
  },
  {
    "day": 26,
    "date": "2026-10-26",
    "weekday_kr": "월",
    "weekday_zh": "周一",
    "weekday_idx": 0,
    "sales": {
      "m1": {
        "volume": 61,
        "revenue": 244000
      },
      "m2": {
        "volume": 42,
        "revenue": 201600
      },
      "m3": {
        "volume": 24,
        "revenue": 127200
      },
      "m4": {
        "volume": 26,
        "revenue": 150800
      },
      "m5": {
        "volume": 20,
        "revenue": 130000
      }
    },
    "day_revenue": 853600
  },
  {
    "day": 27,
    "date": "2026-10-27",
    "weekday_kr": "화",
    "weekday_zh": "周二",
    "weekday_idx": 1,
    "sales": {
      "m1": {
        "volume": 60,
        "revenue": 240000
      },
      "m2": {
        "volume": 35,
        "revenue": 168000
      },
      "m3": {
        "volume": 31,
        "revenue": 164300
      },
      "m4": {
        "volume": 28,
        "revenue": 162400
      },
      "m5": {
        "volume": 18,
        "revenue": 117000
      }
    },
    "day_revenue": 851700
  },
  {
    "day": 28,
    "date": "2026-10-28",
    "weekday_kr": "수",
    "weekday_zh": "周三",
    "weekday_idx": 2,
    "sales": {
      "m1": {
        "volume": 61,
        "revenue": 244000
      },
      "m2": {
        "volume": 41,
        "revenue": 196800
      },
      "m3": {
        "volume": 26,
        "revenue": 137800
      },
      "m4": {
        "volume": 24,
        "revenue": 139200
      },
      "m5": {
        "volume": 20,
        "revenue": 130000
      }
    },
    "day_revenue": 847800
  },
  {
    "day": 29,
    "date": "2026-10-29",
    "weekday_kr": "목",
    "weekday_zh": "周四",
    "weekday_idx": 3,
    "sales": {
      "m1": {
        "volume": 55,
        "revenue": 220000
      },
      "m2": {
        "volume": 48,
        "revenue": 230400
      },
      "m3": {
        "volume": 28,
        "revenue": 148400
      },
      "m4": {
        "volume": 31,
        "revenue": 179800
      },
      "m5": {
        "volume": 18,
        "revenue": 117000
      }
    },
    "day_revenue": 895600
  },
  {
    "day": 30,
    "date": "2026-10-30",
    "weekday_kr": "금",
    "weekday_zh": "周五",
    "weekday_idx": 4,
    "sales": {
      "m1": {
        "volume": 63,
        "revenue": 252000
      },
      "m2": {
        "volume": 42,
        "revenue": 201600
      },
      "m3": {
        "volume": 25,
        "revenue": 132500
      },
      "m4": {
        "volume": 16,
        "revenue": 92800
      },
      "m5": {
        "volume": 19,
        "revenue": 123500
      }
    },
    "day_revenue": 802400
  }
];

const WEEKDAY_SUMMARY = [
  {
    "weekday_idx": 0,
    "weekday_kr": "월",
    "weekday_zh": "周一",
    "count": 4,
    "total_revenue": 3527900,
    "avg_revenue": 881975
  },
  {
    "weekday_idx": 1,
    "weekday_kr": "화",
    "weekday_zh": "周二",
    "count": 4,
    "total_revenue": 3471200,
    "avg_revenue": 867800
  },
  {
    "weekday_idx": 2,
    "weekday_kr": "수",
    "weekday_zh": "周三",
    "count": 4,
    "total_revenue": 3343300,
    "avg_revenue": 835825
  },
  {
    "weekday_idx": 3,
    "weekday_kr": "목",
    "weekday_zh": "周四",
    "count": 5,
    "total_revenue": 4410400,
    "avg_revenue": 882080
  },
  {
    "weekday_idx": 4,
    "weekday_kr": "금",
    "weekday_zh": "周五",
    "count": 5,
    "total_revenue": 4188400,
    "avg_revenue": 837680
  },
  {
    "weekday_idx": 5,
    "weekday_kr": "토",
    "weekday_zh": "周六",
    "count": 4,
    "total_revenue": 4773100,
    "avg_revenue": 1193275
  },
  {
    "weekday_idx": 6,
    "weekday_kr": "일",
    "weekday_zh": "周日",
    "count": 4,
    "total_revenue": 4559300,
    "avg_revenue": 1139825
  }
];

const TOTAL_STATS = {
  totalRevenue: 28273600,
  totalVolume: 5775,
  menuTotals: {
  "m1": {
    "volume": 2089,
    "revenue": 8356000
  },
  "m2": {
    "volume": 1394,
    "revenue": 6691200
  },
  "m3": {
    "volume": 903,
    "revenue": 4785900
  },
  "m4": {
    "volume": 840,
    "revenue": 4872000
  },
  "m5": {
    "volume": 549,
    "revenue": 3568500
  }
}
};
