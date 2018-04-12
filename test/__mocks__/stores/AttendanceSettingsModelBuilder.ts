import { AttendanceSettings } from "~/types"

class AttendanceSettingsModelBuilder {
  public static build(props?: Partial<AttendanceSettings>) {
    return AttendanceSettingsModelBuilder.of(props).build()
  }

  public static of(props?: Partial<AttendanceSettings>): AttendanceSettingsModelBuilder {
    return new AttendanceSettingsModelBuilder(props)
  }

  private static _defaultProps = {
    start: "09:00",
    end: "17:30",
    projectId: "000001",
  }

  private _props: AttendanceSettings = {
    start: "09:00",
    end: "17:30",
    projectId: "000001",
  }

  constructor(props: Partial<AttendanceSettings> = {}) {
    this._props = { ...AttendanceSettingsModelBuilder._defaultProps, ...props }
  }

  public build(): AttendanceSettings {
    return this._props
  }
}

export {
  AttendanceSettingsModelBuilder,
}
export default AttendanceSettingsModelBuilder
