/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React from "react";

import {
  Dialog,
  Input,
  Button,
  MenuButton,
  EditIcon,
  Flex,
  FlexItem,
  CallRecordingIcon,
  Segment,
  Dropdown,
  AddIcon,
  TrashCanIcon,
} from "@fluentui/react-northstar";

export class ResourceList {
  constructor(list) {
    this.list = React.useState(list);
  }
  getColor(id) {
    const [state, setState] = this.list;
    let color = state.find((e) => e.id === id)?.color;
    return color;
  }
  getIndex(id) {
    const [state, setState] = this.list;
    return state.indexOf(state.find((e) => e.id === id));
  }

  updateItem(item) {
    //Item id cannot be changed !
    const [state, setState] = this.list;
    let list = state;
    let oldItem = list.find((e) => e.id === item.id);
    let index = list.indexOf(oldItem);
    list[index] = item;
    setState(list);
  }
  addItem(item) {
    const [state, setState] = this.list;
    let list = state;
    list.push(item);
    setState(list);
  }
  deleteItem(item) {
    const [state, setState] = this.list;
    let list = state;
    let index = list.indexOf(list.find((e) => e.id === item.id));
    list.splice(index, 1);
    setState(list);
  }
}

ResourceList.Item = class {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
};

export class EventList {
  constructor(list) {
    this.list = React.useState(list);
  }
  updateItem(item) {
    //Item id cannot be changed !
    const [state, setState] = this.list;
    let list = state;
    let oldItem = list.find((e) => e.id === item.id);
    let index = list.indexOf(oldItem);
    list[index] = item;
    console.log(oldItem.text, item.text);
    setState(list);
  }
  addItem(item) {
    const [state, setState] = this.list;
    let list = state;
    list.push(item);
    setState(list);
  }
  deleteItem(eventId) {
    const [state, setState] = this.list;
    const filterd = state.filter((e) => e.id !== eventId);
    setState(filterd);
  }
  deleteItemRow(resourceId) {
    const [state, setState] = this.list;
    const filtered = state.filter((e) => e.resourceId !== resourceId);
    setState(filtered);
  }
}

EventList.Item = class {
  constructor(id, resourceId, start, end, text) {
    this.id = id;
    this.resourceId = resourceId;
    this.start = start;
    this.end = end;
    this.text = text;
  }
};
/*TODO implement this function
const uid = function(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}*/

export class Scheduler {
  config = {
    date: {
      start: new Date(),
      end: new Date(),
    },
    colors: [
      { name: "Blau", hex: "#7b83eb" },
      { name: "Grün", hex: "#8bc34a" },
      { name: "Rot", hex: "#f44336" },
      { name: "Gelb", hex: "#ff9800" },
    ],
    size: {
      cell: 40, //TODO: Ability to change cell sizes to 25/30/35/40
    },
    resources: [],
    events: [],
  };

  ref = {
    scheduler_default_timeheader_scroll: React.createRef(),
  };

  state = React.useState({
    dialog: {
      resources: false,
      addResource: false,
      deleteResource: false,
      event: false,
      editEvent: false,
    },
    deleteResourceItem: undefined,
    editEventItem: undefined,
    eventItem: undefined,
    title: "test",
    eventValidation: {
      resourceId: false,
      start: false,
      end: false,
    },
  });

  syncScroll = () => {
    const timeheader = document.getElementById(
      "scheduler_default_timeheader_scroll"
    );
    const defaultScroll = document.getElementById(
      "scheduler_default_scrollable"
    );
    timeheader.scrollLeft = defaultScroll.scrollLeft;
  };
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
  getStateDialogObject(state, data) {
    return { ...state, dialog: { ...state.dialog, ...data } };
  }
  HTML = {
    ResourceList: () => {
      const [state, setState] = this.config.resources.list;
      const itemList = state.map((item, index) => {
        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: index * this.config.size.cell,
              width: "128px",
              border: "0px none",
            }}
            unselectable="on"
          >
            <div
              className="scheduler_resource"
              style={{ height: this.config.size.cell }}
            >
              <div className="scheduler_resource_inner">{item.name}</div>
              <div className="scheduler_resourcedivider" />
            </div>
          </div>
        );
      });
      return itemList;
    },
    Dialog: () => {
      const [state, setState] = this.state;
      const Resource = () => {
        const [stateResourceList, setStateResourceList] =
          this.config.resources.list;
        const [stateAddResourceColor, setStateAddResourceColor] =
          React.useState(this.config.colors[0]);
        //Necessary because otherwise the state changes with the color state
        const [stateAddResourceInput, setStateAddResourceInput] =
          React.useState(`Gewerk ${stateResourceList.length + 1}`);
        //

        let changedNames = [];
        let changedColors = [];
        let colorChange = (index) => {
          if (index === this.config.colors.length - 1) {
            index = 0;
          } else {
            index++;
          }
          return this.config.colors[index];
        };

        let ResourceItems = () => {
          const [stateResourceList, setStateResourceList] =
            this.config.resources.list;
          let itemList = stateResourceList.map((item) => {
            const [colorState, setColorState] = React.useState(
              this.config.colors.find((e) => e.hex === item.color)
            );

            return (
              <div className="resource_item" key={item.id + "resource"}>
                <Flex gap="gap.medium">
                  <FlexItem>
                    <Button
                      icon={<TrashCanIcon />}
                      iconOnly
                      text
                      style={{ paddingRight: 15, margin: 0 }}
                      onClick={() => {
                        setState({
                          ...this.getStateDialogObject(state, {
                            deleteResource: true,
                            resources: false,
                          }),
                          deleteResourceItem: item,
                        });
                      }}
                    />
                  </FlexItem>
                  <FlexItem>
                    <Input
                      icon={<EditIcon />}
                      placeholder={item.name}
                      clearable
                      type="text"
                      fluid
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value !== undefined) {
                          changedNames[item.id] = {
                            id: item.id,
                            value: value,
                          };
                        } else {
                          changedNames.splice(item.id, 1);
                        }
                      }}
                    />
                  </FlexItem>
                  <FlexItem>
                    <Button
                      circular
                      icon={
                        <CallRecordingIcon
                          style={{
                            color: colorState.hex,
                            position: "absolute",
                            right: 15,
                          }}
                        />
                      }
                      iconPosition="after"
                      onClick={(e) => {
                        let color = colorChange(
                          this.config.colors.indexOf(colorState)
                        );
                        changedColors[item.id] = { id: item.id, color: color };
                        setColorState(color);
                      }}
                      content={colorState.name}
                      style={{ borderColor: colorState.hex, minWidth: 100 }}
                    />
                  </FlexItem>
                </Flex>
              </div>
            );
          });
          return itemList;
        };
        let saveChangedData = () => {
          const [state, setState] = this.config.resources.list;
          changedNames.forEach((i) => {
            let item = state.find((e) => e.id === i.id);
            item.name = i.value;
            this.config.resources.updateItem(item);
          });

          changedColors.forEach((i) => {
            let item = state.find((e) => e.id === i.id);
            item.color = i.color.hex;
            this.config.resources.updateItem(item);
          });
        };
        let resourceDialogConfirm = () => {
          saveChangedData();
          //Close Dialog
          setState(this.getStateDialogObject(state, { resources: false }));
          /*SAVE Data*/
        };
        let deleteResourceItem = () => {
          this.config.resources.deleteItem(state.deleteResourceItem);
          this.config.events.deleteItemRow(state.deleteResourceItem.id);
        };
        //Resource add dialog

        let createResourceItem = () => {
          this.config.resources.addItem(
            new ResourceList.Item(
              stateResourceList.length + 1,
              stateAddResourceInput,
              stateAddResourceColor.hex
            )
          );
        };

        return (
          <>
            <Dialog
              closeOnOutsideClick={false}
              open={state.dialog.resources}
              id="dialog_resource"
              content={
                <>
                  <h2 className="dialog_title">Gewerke verwalten</h2>
                  <div className="dialog_content">
                    <Button
                      fluid
                      primary
                      content="Gewerk hinzufügen"
                      icon={<AddIcon />}
                      onClick={() => {
                        saveChangedData();

                        setState(
                          this.getStateDialogObject(state, {
                            resources: false,
                            addResource: true,
                          })
                        );
                      }}
                    />
                    <div id="dialog_resource_list">
                      <ResourceItems />
                    </div>
                  </div>
                </>
              }
              confirmButton="Fertig"
              onConfirm={resourceDialogConfirm}
            />
            <Dialog
              closeOnOutsideClick={false}
              open={state.dialog.addResource}
              id="dialog_resource"
              content={
                <>
                  <h2 className="dialog_title">Gewerke hinzufügen</h2>
                  <div className="dialog_content">
                    <Flex gap="gap.medium">
                      <FlexItem>
                        <Input
                          icon={<EditIcon />}
                          clearable
                          placeholder={`Gewerk ${stateResourceList.length + 1}`}
                          onChange={(e) => {
                            let value = e.target.value;
                            let isEmpty = value.trim().length === 0;
                            if (!isEmpty) {
                              setStateAddResourceInput(value);
                            } else {
                              setStateAddResourceInput(
                                `Event ${stateResourceList.length + 1}`
                              );
                            }
                          }}
                          type="text"
                          fluid
                        />
                      </FlexItem>
                      <FlexItem>
                        <Button
                          circular
                          icon={
                            <CallRecordingIcon
                              style={{
                                color: stateAddResourceColor.hex,
                                position: "absolute",
                                right: 15,
                              }}
                            />
                          }
                          iconPosition="after"
                          onClick={(e) => {
                            let color = colorChange(
                              this.config.colors.indexOf(stateAddResourceColor)
                            );
                            setStateAddResourceColor(color);
                          }}
                          content={stateAddResourceColor.name}
                          style={{
                            borderColor: stateAddResourceColor.hex,
                            minWidth: 100,
                          }}
                        />
                      </FlexItem>
                    </Flex>
                  </div>
                </>
              }
              cancelButton="Abbrechen"
              confirmButton="Hinzufügen"
              onConfirm={() => {
                createResourceItem();
                setState(
                  this.getStateDialogObject(state, {
                    resources: true,
                    addResource: false,
                  })
                );
              }}
              onCancel={() => {
                setState(
                  this.getStateDialogObject(state, {
                    resources: true,
                    addResource: false,
                  })
                );
              }}
            />
            <Dialog
              closeOnOutsideClick={false}
              open={state.dialog.deleteResource}
              id="dialog_resource"
              content={
                <>
                  <h2 className="dialog_title">Gewerk löschen?</h2>
                  <div className="dialog_content">
                    <span style={{ color: "rgb(73 73 73)", fontWeight: 600 }}>
                      {`${state.deleteResourceItem?.name} `}
                    </span>
                    wird entgültig aus der Datenbank entfernt, und kann nicht
                    wieder aufgerufen werden.
                  </div>
                </>
              }
              cancelButton="Abbrechen"
              confirmButton="Löschen"
              onConfirm={() => {
                deleteResourceItem();

                setState(
                  this.getStateDialogObject(state, {
                    resources: true,
                    deleteResource: false,
                  })
                );
              }}
              onCancel={() => {
                setState(
                  this.getStateDialogObject(state, {
                    resources: true,
                    deleteResource: false,
                  })
                );
              }}
            />
          </>
        );
      };
      const Event = () => {
        const [stateEventList, setStateEventList] = this.config.events.list;
        const [stateResourceList, setStateResourceList] = this.config.resources.list;
        const minDate = this.config.date.start.toISOString().substring(0, 10);
        const maxDate = new Date(this.config.date.end.setUTCHours(24)).toISOString().substring(0, 10);

        let event = {
          resourceId: undefined,
          start: undefined,
          end: undefined,
          text: `Event ${stateEventList.length + 1}`,
        };

        //Same item like event! But only for the "Edit Dialog"
        let eventEdit = {
          ...state.editEventItem,
        };

        let validation = () => {
          const start = new Date(event.start);
          const end = new Date(event.end);

          let val = {
            resourceId: event.resourceId !== undefined,
            start: start > this.config.date.start && start < end,
            end: end < this.config.date.end && end > start,
          };
          return val;
        };

        let createEventItem = () => {
          const valid = validation();
          console.log(valid)
          if(!valid.start || !valid.end || !valid.resourceId) return false;
          this.config.events.addItem(
            new EventList.Item(
              stateEventList.length + 1,
              event.resourceId,
              event.start,
              event.end,
              event.text
            )
          );
          return true;
        };
        let updateEventItem = () => {
          this.config.events.updateItem(
            new EventList.Item(
              state.editEventItem.id,
              eventEdit.resourceId,
              eventEdit.start,
              eventEdit.end,
              eventEdit.text
            )
          );
        };
        function a (e) {
          setState({...state, title: e.target.value })
        }
        //TODO: 
        //https://medium.com/capital-one-tech/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b
        //Use bind to pass arguments and update the input field without risking losing any data in the dialog box

                return (
          <>
            <Dialog
              closeOnOutsideClick={false}
              open={state.dialog.event}
              id="dialog_event"
              content={
                <>
                  <h2 className="dialog_title">Event hinzufügen</h2>
                  <div className="dialog_content">
                    <Flex column gap="gap.small">
                      <Input
                        label="Text:"
                        type="text"
                        placeholder={`Event ${stateEventList.length + 1}`}
                        value={this.state.title}
                        onChange={() => (a.bind(this))}
                        fluid
                      />
                      <Dropdown
                        placeholder="Wähle ein Gewerk aus"
                        items={stateResourceList.map((item) => {
                          return { header: item.name, data: item };
                        })}
                        fluid
                        getA11ySelectionMessage={{
                          onAdd: (item) => (event.resourceId = item.data.id),
                        }}
                        renderItem={(Item, props) => (
                          <Item
                            {...props}
                            header={
                              <>
                                <CallRecordingIcon
                                  style={{
                                    color: props.data.color,
                                    position: "absolute",
                                    marginTop: 2,
                                  }}
                                />
                                <span style={{ marginLeft: 22 }}>
                                  {props.header}
                                </span>
                              </>
                            }
                          />
                        )}
                      />
                      <Flex gap="gap.small">
                        <Input
                          type="date"
                          label="Von:"
                        //  error={state.eventValidation.start}
                          min={minDate}
                          max={maxDate}
                          fluid
                          onChange={(evt) => {
                            event.start = evt.target.value;
                           // validation();
                          }}
                        />
                        <Input
                          type="date"
                          label="Bis:"
                          min={minDate}
                          max={maxDate}
                          fluid
                          onChange={(evt) => {
                            event.end = evt.target.value;
                          //  validation();
                          }}
                        />
                      </Flex>
                    </Flex>
                  </div>
                </>
              }
              cancelButton="Abbrechen"
              confirmButton="Hinzufügen"
              onConfirm={() => {
                const isCreated = createEventItem();
                if (!isCreated) return;
                /*SAVE Data*/
                setState(this.getStateDialogObject(state, { event: false }));
              }}
              onCancel={() =>
                setState(this.getStateDialogObject(state, { event: false }))
              }
            />
            <Dialog
              closeOnOutsideClick={false}
              open={state.dialog.editEvent}
              id="dialog_event"
              content={
                <>
                  <h2 className="dialog_title">Event bearbeiten</h2>
                  <div className="dialog_content">
                    <Flex column gap="gap.small">
                      <Input
                        label="Text:"
                        type="text"
                        placeholder={eventEdit?.text}
                        onChange={(evt) => (eventEdit.text = evt.target.value)}
                        fluid
                      />
                      <Dropdown
                        placeholder={
                          stateResourceList[
                            this.config.resources.getIndex(
                              eventEdit?.resourceId
                            )
                          ]?.name
                        }
                        items={stateResourceList.map((item) => {
                          return { header: item.name, data: item };
                        })}
                        fluid
                        getA11ySelectionMessage={{
                          onAdd: (item) =>
                            (eventEdit.resourceId = item.data.id),
                        }}
                        renderItem={(Item, props) => (
                          <Item
                            {...props}
                            header={
                              <>
                                <CallRecordingIcon
                                  style={{
                                    color: props.data.color,
                                    position: "absolute",
                                    marginTop: 2,
                                  }}
                                />
                                <span style={{ marginLeft: 22 }}>
                                  {props.header}
                                </span>
                              </>
                            }
                          />
                        )}
                      />
                      <Flex gap="gap.small">
                        <Input
                          type="date"
                          label="Von:"
                          value={eventEdit?.start}
                          min={minDate}
                          max={maxDate}
                          fluid
                          onChange={(evt) => {
                            let event = eventEdit;
                            event.start = evt.target.value;
                            setState({ ...state, editEventItem: event });
                          }}
                        />
                        <Input
                          type="date"
                          label="Bis:"
                          value={eventEdit?.end}
                          min={minDate}
                          max={maxDate}
                          fluid
                          onChange={(evt) => {
                            let event = eventEdit;
                            event.end = evt.target.value;
                            setState({ ...state, editEventItem: event });
                          }}
                        />
                      </Flex>
                    </Flex>
                  </div>
                </>
              }
              cancelButton="Abbrechen"
              confirmButton="Fertig"
              onConfirm={() => {
                updateEventItem();
                /*SAVE Data*/
                setState(
                  this.getStateDialogObject(state, { editEvent: false })
                );
              }}
              onCancel={() =>
                setState(this.getStateDialogObject(state, { editEvent: false }))
              }
            />
          </>
        );
      };
      return (
        <>
          <Resource />
          <Event />
        </>
      );
    },
    Cells: () => {
      const [state, setState] = this.config.resources.list;
      let currentDate = new Date(this.config.date.start);
      let itemList = [];
      for (
        let row = 0; //day
        row <=
        this.getDaysBetween(this.config.date.start, this.config.date.end);
        row++
      ) {
        const isWeekend =
          currentDate.getDay() === 0 || currentDate.getDay() === 6;
        currentDate.setDate(currentDate.getDate() + 1);
        for (let column = 0; column < state.length; column++) {
          let getClassNames = () => {
            const _class = {
              default: "scheduler_cell",
              weekend: "scheduler_cell_weekend",
              border: {
                //tick
                rt: "scheduler_cell_border_rt",
                lt: "scheduler_cell_border_lt",
                //default
                default: "scheduler_cell_border_default",
              },
            };
            let string = _class.default;
            function add(className) {
              string += ` ${className}`;
            }
            const dayIndex = currentDate.getDay();
            if (isWeekend) {
              add(_class.weekend);
              add(dayIndex === 0 ? _class.border.default : _class.border.rt);
            } else if (dayIndex !== 6) {
              add(_class.border.default);
            } else {
              add(_class.border.rt);
            }
            return string;
          };

          itemList.push(
            <div
              key={`${column.toString()}_${row.toString()}`}
              className={getClassNames()}
              style={{
                top: column * this.config.size.cell,
                left: row * this.config.size.cell,
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
      const [state, setState] = this.state;
      const [stateEventList, setStateEventList] = this.config.events.list;
      const itemList = stateEventList.map((item, index) => {
        const resourceIndex = this.config.resources.getIndex(item.resourceId);

        let getLeftPositioning = () => {
          return (
            this.getDaysBetween(this.config.date.start, item.start) *
            this.config.size.cell
          );
        };

        return (
          <div
            key={`event_parent_${item.id}`}
            style={{
              left: getLeftPositioning(),
              position: "absolute",
              top: resourceIndex * this.config.size.cell,
              width:
                (this.getDaysBetween(item.start, item.end) + 1) *
                this.config.size.cell,
            }}
          >
            <MenuButton
              className="scheduler_event_settings"
              trigger={
                <div
                  className="scheduler_default_event"
                  style={{
                    backgroundColor: this.config.resources.getColor(
                      item.resourceId
                    ),
                    height: this.config.size.cell,
                    lineHeight: this.config.size.cell + "px",
                  }}
                >
                  {item.text}
                </div>
              }
              menu={[
                <Button
                  text
                  key={`event_menuButton_edit_${item.id}`}
                  content="Bearbeiten"
                  icon={<EditIcon />}
                  onClick={() => {
                    setState({
                      ...this.getStateDialogObject(state, { editEvent: true }),
                      editEventItem: item,
                    });
                  }}
                />,
                <Button
                  text
                  key={`event_menuButton_delete_${item.id}`}
                  content="Löschen"
                  icon={<TrashCanIcon />}
                  onClick={() => this.config.events.deleteItem(item.id)}
                />,
              ]}
            />
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
        let month = date.getMonth() + 1; // use 1-12
        let year = date.getFullYear();
        let day = date.getDate();
        let a = Math.floor((14 - month) / 12);
        let y = year + 4800 - a;
        let m = month + 12 * a - 3;
        let jd =
          day +
          Math.floor((153 * m + 2) / 5) +
          365 * y +
          Math.floor(y / 4) -
          Math.floor(y / 100) +
          Math.floor(y / 400) -
          32045; // (gregorian calendar)

        //calc weeknumber
        let d4 = (((jd + 31741 - (jd % 7)) % 146097) % 36524) % 1461;
        let L = Math.floor(d4 / 1460);
        let d1 = ((d4 - L) % 365) + L;
        let NumberOfWeek = Math.floor(d1 / 7) + 1;
        return NumberOfWeek;
      };
      let getLeftPositioning = () => {
        const weekNumber = getWeekNumber(currentDate);
        const usedDays = getUsedDaysOfWeek(weekNumber);
        offsetX += usedDays * this.config.size.cell;
        return offsetX - usedDays * this.config.size.cell;
      };

      let getUsedDaysOfWeek = (weekNumber) => {
        let days = 0;
        const date = new Date(currentDate);
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
      for (let column = 0; column <= daysBetween; column++) {
        const isWeekend =
          currentDate.getDay() === 0 || currentDate.getDay() === 6;
        itemList.push(
          <div
            key={column}
            className="scheduler_timeheader_day"
            style={{
              left: column * this.config.size.cell,
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
      const [state, setState] = this.config.resources.list;
      return (
        <>
          <this.HTML.Dialog />
          <div id="scheduler_main">
            <div
              id="scheduler_divider_vertical"
              style={{
                height: state.length * this.config.size.cell + 105,
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
                    top: state.length * this.config.size.cell,
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
            onScroll={this.syncScroll}
            style={{
              height: state.length * this.config.size.cell + 15,
            }}
          >
            <this.HTML.Cells />
            <this.HTML.Events />
          </div>
        </>
      );
    },
  };
}
