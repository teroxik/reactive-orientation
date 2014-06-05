package actors

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import actors.StreamMergingActor._
import json.JsonFormats._
import play.api.libs.iteratee.Concurrent.Channel
import scalaz.Lens

object StreamMergingActor {
  case class OrientationChangeEvent(deviceInfo: String, deviceId: String, colour: Int, data: OrientationChangeData)
  case class OrientationChangeData(alpha: Double, beta: Double, gamma: Double)
}

trait DegreesToRadiansConversions {

  def convertDegreesToRadians(event: OrientationChangeEvent) = {
    val dataLens = Lens.lensu[OrientationChangeEvent, OrientationChangeData] (
      (a, value) => a.copy(data = value),
      _.data
    )
    dataLens mod ((data:OrientationChangeData) => OrientationChangeData(math.toRadians(data.alpha),math.toRadians(data.beta),math.toRadians(data.gamma)),event)
  }

}

class StreamMergingActor(dataChannel: Channel[JsValue]) extends Actor with DegreesToRadiansConversions {

  def receive = {
    case e: OrientationChangeEvent =>
      println(self + e.toString)
      produceMessage(convertDegreesToRadians(e))
  }

  def produceMessage(event: OrientationChangeEvent) = dataChannel.push(Json.toJson(event))
}
