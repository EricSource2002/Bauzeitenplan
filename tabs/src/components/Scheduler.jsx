/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React from "react";

import {
  Dialog,
  Input,
  Button,
  EditIcon,
  Flex,
  FlexItem,
  CallRecordingIcon,
} from "@fluentui/react-northstar";
export default class Scheduler {
  config = {
    date: {
      start: new Date(),
      end: new Date(),
    },
    colors: [
      { name: "Blau", hex: "#7b83eb" },
      { name: "Grün", hex: "#8bc34a" },
      { name: "Rot", hex: "#f44336" },
      { name: "Orange", hex: "#ff9800" },
    ],
    dialog: {
      resources: React.useState(false),
      event: React.useState(false),
    },
    size: {
      cell: 40,
    },
    resources: [],
    events: [],
  };

  ref = {
    scheduler_default_scrollable: React.createRef(),
    scheduler_default_timeheader_scroll: React.createRef(),
  };

  syncScroll() {
    var timeheader = document.getElementById(
      "scheduler_default_timeheader_scroll"
    );
    var defaultScroll = document.getElementById("scheduler_default_scrollable");
    timeheader.scrollLeft = defaultScroll.scrollLeft;
  }

  getDaysBetween(startDate, endDate) {
    var daysBetween = Math.floor(
      (Date.parse(endDate) - Date.parse(startDate)) / (24 * 60 * 60 * 1000)
    );
    return daysBetween;
  }
  getDaysInMonth(anyDateInMonth) {
    return new Date(
      anyDateInMonth.getFullYear(),
      anyDateInMonth.getMonth() + 1,
      0
    ).getDate();
  }
  getDaysOf;
  HTML = {
    ResourceList: () => {
      const itemList = this.config.resources.map((resource) => (
        <div
          key={resource.id}
          style={{
            position: "absolute",
            top: resource.id * this.config.size.cell,
            width: "128px",
            border: "0px none",
          }}
          unselectable="on"
        >
          <div
            className="scheduler_resource"
            style={{ height: this.config.size.cell }}
          >
            <div className="scheduler_resource_inner">{resource.name}</div>
            <div className="scheduler_resourcedivider" />
          </div>
        </div>
      ));
      return itemList;
    },
    Dialog: () => {
      const [stateResources, setStateResources] = this.config.dialog.resources;
      const [stateEvent, setStateEvent] = this.config.dialog.event;
      let ResourceItems = () => {
        let colorChange = (resource) => {
          
        }
        let itemList = this.config.resources.map((res) => {
          const color = this.config.colors.find((e) => e.hex === res.color);
          return (
            <div className="resource_item" key={res.id + "resource"}>
              <Flex gap="gap.medium">
                <FlexItem>
                  <Input
                    icon={<EditIcon />}
                    placeholder={res.name}
                    clearable
                    type="text"
                    fluid
                  />
                </FlexItem>
                <FlexItem>
                  <Button
                    icon={<CallRecordingIcon style={{ color: color.hex, position: "absolute", right: 15}} />}
                    iconPosition="after"
                    onClick={colorChange(res)}
                    content={color.name}
                    style={{ borderColor: color.hex, minWidth: 100}}
                  ></Button>
                </FlexItem>
              </Flex>
            </div>
          );
        });
        return itemList;
      };

      return (
        <Dialog
          open={stateResources}
          id="dialog_resource"
          content={
            <>
              <h2 className="dialog_title">Ressourcen verwalten</h2>
              <div className="dialog_content">
                <ResourceItems />
              </div>
            </>
          }
          cancelButton="Abbrechen"
          confirmButton="Speichern"
          onConfirm={() => {
            setStateResources(false); /*SAVE Data*/
          }}
          onCancel={() => setStateResources(false)}
        />
      );
    },
    Cells: () => {
      let itemList = [];
      for (
        let day = 0;
        day <=
        this.getDaysBetween(this.config.date.start, this.config.date.end);
        day++
      ) {
        for (let row = 0; row < this.config.resources.length; row++) {
          itemList.push(
            <div
              key={day.toString() + row.toString()}
              className="scheduler_cell"
              style={{
                top: row * this.config.size.cell,
                left: day * this.config.size.cell,
                height: this.config.size.cell,
                width: this.config.size.cell,
              }}
            />
          );
        }
      }
      return itemList;
    },
    Events: () => {
      let itemList = this.config.events.map((event) => {
        let getLeftPositioning = () => {
          return (
            this.getDaysBetween(this.config.date.start, event.start) *
            this.config.size.cell
          );
        };
        return (
          <div
            className="scheduler_default_event"
            key={event.id + "event"}
            style={{
              backgroundColor: this.config.resources.find(
                (res) => res.id === event.id
              ).color,
              width:
                this.getDaysBetween(event.start, event.end) *
                this.config.size.cell,
              left: getLeftPositioning(),
              top: event.id * this.config.size.cell,
              height: this.config.size.cell,
              lineHeight: this.config.size.cell + "px",
            }}
          >
            {event.text}
          </div>
        );
      });
      return itemList;
    },
    Timeheader_Month: () => {
      let startDate = this.config.date.start;
      let endDate = this.config.date.end;
      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );
      let currentDate = new Date(this.config.date.start);

      let offsetX = 0;
      let getLeftPositioning = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const isStartEqualCurrentDate =
          startDate.getMonth() === currentMonth &&
          startDate.getFullYear() === currentYear;
        offsetX += getUsedDaysOfMonth() * this.config.size.cell;
        if (isStartEqualCurrentDate) {
          return 0;
        }
        return offsetX - getUsedDaysOfMonth() * this.config.size.cell;
      };

      let getUsedDaysOfMonth = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const isStartEqualCurrentDate =
          startDate.getMonth() === currentMonth &&
          startDate.getFullYear() === currentYear;
        const isEndEqualCurrentDate =
          endDate.getMonth() === currentMonth &&
          endDate.getFullYear() === currentYear;

        if (isStartEqualCurrentDate || isEndEqualCurrentDate) {
          if (isStartEqualCurrentDate && isEndEqualCurrentDate) {
            return this.getDaysBetween(startDate, endDate) + 1;
          } else if (isStartEqualCurrentDate) {
            let date = new Date(startDate);
            date.setMonth(date.getMonth() + 1);
            date.setDate(1);
            return this.getDaysBetween(startDate, date);
          } else {
            let date = new Date(endDate);
            date.setDate(1);
            return this.getDaysBetween(date, endDate) + 1;
          }
        } else {
          return this.getDaysInMonth(currentDate);
        }
      };

      let itemList = [];
      let monthCache = null;
      for (let day = 0; day <= daysBetween; day++) {
        if (monthCache !== currentDate.getMonth()) {
          monthCache = currentDate.getMonth();

          itemList.push(
            <div
              key={currentDate}
              className="scheduler_timeheader_month"
              style={{
                width: getUsedDaysOfMonth() * this.config.size.cell,
                left: getLeftPositioning(),
                userSelect: "none",
              }}
            >
              {currentDate.toLocaleString("de-DE", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </div>
          );
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return itemList;
    },
    Timeheader_Week: () => {
      let endDate = this.config.date.end;

      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );

      let currentDate = new Date(this.config.date.start);
      let offsetX = 0;

      let getWeekNumber = (date) => {
        var month = date.getMonth() + 1; // use 1-12
        var year = date.getFullYear();
        var day = date.getDate();
        var a = Math.floor((14 - month) / 12);
        var y = year + 4800 - a;
        var m = month + 12 * a - 3;
        var jd =
          day +
          Math.floor((153 * m + 2) / 5) +
          365 * y +
          Math.floor(y / 4) -
          Math.floor(y / 100) +
          Math.floor(y / 400) -
          32045; // (gregorian calendar)

        //calc weeknumber
        var d4 = (((jd + 31741 - (jd % 7)) % 146097) % 36524) % 1461;
        var L = Math.floor(d4 / 1460);
        var d1 = ((d4 - L) % 365) + L;
        var NumberOfWeek = Math.floor(d1 / 7) + 1;
        return NumberOfWeek;
      };
      let getLeftPositioning = () => {
        const weekNumber = getWeekNumber(currentDate);
        const usedDays = getUsedDaysOfWeek(weekNumber);
        offsetX += usedDays * this.config.size.cell;
        return offsetX - usedDays * this.config.size.cell;
      };

      let getUsedDaysOfWeek = (weekNumber) => {
        const date = new Date(currentDate);
        let days = 0;
        const lastDay = new Date(endDate);
        lastDay.setDate(lastDay.getDate() + 1);
        while (
          weekNumber === getWeekNumber(date) &&
          date.toString() !== lastDay.toString()
        ) {
          date.setDate(date.getDate() + 1);
          days++;
        }
        return days;
      };

      let itemList = [];
      let weekCache = null;

      for (let day = 0; day <= daysBetween; day++) {
        const weekNumber = getWeekNumber(currentDate);
        if (weekCache !== weekNumber) {
          let width = getUsedDaysOfWeek(weekNumber) * this.config.size.cell;
          weekCache = weekNumber;
          itemList.push(
            <div
              key={weekNumber.toString() + currentDate.toDateString()}
              className="scheduler_timeheader_week"
              style={{
                width: width,
                left: getLeftPositioning(),
                userSelect: "none",
              }}
            >
              KW{weekNumber}
            </div>
          );
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return itemList;
    },
    Timeheader_Day: () => {
      let itemList = [];
      let currentDate = new Date(this.config.date.start);
      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );
      for (let day = 0; day <= daysBetween; day++) {
        itemList.push(
          <div
            key={day}
            className="scheduler_timeheader_day"
            style={{
              left: day * this.config.size.cell,
              userSelect: "none",
              width: this.config.size.cell,
            }}
          >
            {currentDate.getDate()}
          </div>
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return itemList;
    },
    Scheduler: () => {
      return (
        <>
          <this.HTML.Dialog />
          <div id="scheduler_main" style={{ height: "388px" }}>
            <div
              id="scheduler_divider_vertical"
              style={{
                height:
                  this.config.resources.length * this.config.size.cell + 105,
              }}
            />
            <div id="scheduler_divider_horizontal" />

            <div id="scheduler_sidebar">
              <div id="scheduler_corner">
                <h3 id="scheduler_corner_inner">Gewerke</h3>
              </div>

              <div id="scheduler_resource_table">
                <this.HTML.ResourceList />

                <div
                  id="scheduler_default_rowEnd"
                  style={{
                    top: this.config.resources.length * this.config.size.cell,
                  }}
                />
              </div>
            </div>
          </div>
          <div
            id="scheduler_default_timeheader_scroll"
            ref={this.ref.scheduler_default_timeheader_scroll}
          >
            <this.HTML.Timeheader_Month />
            <this.HTML.Timeheader_Week />
            <this.HTML.Timeheader_Day />
          </div>
          <div
            id="scheduler_default_scrollable"
            ref={this.ref.scheduler_default_scrollable}
            onScroll={this.syncScroll}
            style={{
              height: this.config.resources.length * this.config.size.cell + 15,
            }}
          >
            <this.HTML.Cells />
            <this.HTML.Events />
          </div>
          <div style={{ position: "absolute", top: "-10px", left: "200px" }}>
            <p>
              START:{" "}
              {this.config.date.start.getDate() +
                ". " +
                (this.config.date.start.getMonth() + 1) +
                " " +
                this.config.date.start.getFullYear()}
            </p>
            <p>
              ENDE:{" "}
              {this.config.date.end.getDate() +
                ". " +
                (this.config.date.end.getMonth() + 1) +
                " " +
                this.config.date.end.getFullYear()}
            </p>
          </div>
        </>
      );
    },
  };
}
