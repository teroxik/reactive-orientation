package json

import play.api.libs.json.Json
import actors.StreamMergingActor.{OrientationChangeEvent, OrientationChangeData}
import play.api.mvc.WebSocket.FrameFormatter

object JsonFormats {
  implicit val eventDataJsonFormat = Json.format[OrientationChangeData]
  implicit val eventJsonFormat = Json.format[OrientationChangeEvent]
  implicit val eventFrame: FrameFormatter[OrientationChangeEvent] =
    FrameFormatter.stringFrame.transform(_.toString, Json.parse(_).as[OrientationChangeEvent])
}
