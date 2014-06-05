package actors

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import actors.StreamMergingActor._
import json.JsonFormats._
import play.api.libs.iteratee.Concurrent.Channel
import utils.DegreesToRadiansConversions

object StreamMergingActor {
  case class OrientationChangeEvent(deviceInfo: String, deviceId: String, colour: Int, data: OrientationChangeData)
  case class OrientationChangeData(alpha: Double, beta: Double, gamma: Double)
}

class StreamMergingActor(dataChannel: Channel[JsValue]) extends Actor with DegreesToRadiansConversions {

  def receive = {
    case e: OrientationChangeEvent =>
      println(self + e.toString)
      produceMessage(convertDegreesToRadians(e))
  }

  def produceMessage(event: OrientationChangeEvent) = dataChannel.push(Json.toJson(event))
}
