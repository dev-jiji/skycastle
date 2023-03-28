import { Chart, Inner } from "../../styles/StudentStyles";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { TInner } from "../../styles/TeacherStyles";
import TabMenu from "../../components/TabMenu";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

const AllAverage = () => {
  // 평균 데이터
  const [allAvg, setAllAvg] = useState([]);
  const [topAvg, setTopAvg] = useState([]);

  // 반 데이터
  const [classAvg, setClassAvg] = useState([]);

  const getPosts = async () => {
    const accessToken = window.localStorage.getItem("token");
    const currentMonth = moment().format("YYYYMM");
    await axios
      .get("http://192.168.0.140:8686/api/total/avg", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        // console.log(res.data.avgList);
        setAllAvg(res.data.avgList);
      });
    await axios
      .get("http://192.168.0.140:8686/api/total/top10", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        // console.log(res.data[0].map);
        setTopAvg(res.data[0].map);
      });
    await axios
      .get(
        `http://192.168.0.140:8686/api/stats/avg?yearMonth=${currentMonth}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        // console.log(res.data);
        setClassAvg(res.data);
      });
  };
  useEffect(() => {
    getPosts();
  }, []);

  // "x" 값을 기준으로 오름차순으로 정렬하는 함수
  interface Data {
    x: string;
    y: number;
  }

  const sortByX = (a: Data, b: Data) => a.x.localeCompare(b.x);

  const allData = allAvg
    .map((item: { subjectName: string; totalAvg: number }) => {
      return {
        x: item.subjectName,
        y: item.totalAvg,
      };
    })
    .sort(sortByX);

  const topData = Object.entries(topAvg)
    .map(([x, y]) => ({
      x,
      y,
    }))
    .sort(sortByX);

  //   console.log(allData, topData);

  const firstData = [
    {
      id: "dataset1",
      data: allData,
    },
    {
      id: "dataset2",
      data: topData,
    },
  ];

  console.log(classAvg);

  const classData = classAvg.map(
    (item: {
      className: string;
      scoreList: { 듣기: number; 독해: number; 문법: number; 어휘: number };
    }) => {
      const { scoreList, className } = item;
      return {
        class: className,
        독해: scoreList.독해,
        듣기: scoreList.듣기,
        문법: scoreList.문법,
        어휘: scoreList.어휘,
      };
    }
  );

  console.log(classData);

  return (
    <div>
      <TabMenu menu={"전체 통계"} />
      <Chart>
        <TInner>
          <div className="tChart-title">
            <p>
              <span className="tChart-line text-[#FF9F4A]">-</span>
              &nbsp;상위 10% 평균 점수
            </p>
            <p>
              <span className="tChart-line text-[#5799C7]">-</span>
              &nbsp;학생 전체 평균 점수
            </p>
          </div>
          <ResponsiveLine
            data={firstData}
            // yScale={{
            //   type: "linear",
            //   min: "auto",
            //   max: "auto",
            //   stacked: true,
            //   reverse: false,
            // }}
            margin={{
              top: 100,
              right: 80,
              bottom: 50,
              left: 60,
            }}
            curve="natural"
            axisTop={null}
            axisRight={null}
            colors={{ scheme: "category10" }}
            lineWidth={2}
            enableGridX={false}
            enableGridY={true}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        </TInner>
        <Inner>
          <p>&#8226; 이번 달 반 평균 점수</p>
          <ResponsiveBar
            data={classData}
            keys={["독해", "듣기", "문법", "어휘"]}
            indexBy="class"
            margin={{
              top: 100,
              right: 130,
              bottom: 50,
              left: 60,
            }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "paired" }}
            fill={[
              {
                match: {
                  id: "fries",
                },
                id: "dots",
              },
              {
                match: {
                  id: "문법",
                },
                id: "lines",
              },
            ]}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "반",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "점수",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            role="application"
          />
        </Inner>
      </Chart>
    </div>
  );
};

export default AllAverage;
