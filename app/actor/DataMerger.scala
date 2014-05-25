package actor

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import play.api.libs.iteratee.{Enumerator, Concurrent}
import actor.DataMerger.{RegisterConsumerConfirmation, OrientationChangeEvent, RegisterConsumer, RegisterProducer}
import json.JsonFormats._

object DataMerger {
  case class RegisterProducer(device: String)
  case class RegisterConsumerConfirmation(enumerator: Enumerator[JsValue])
  case class RegisterConsumer(device: String)
  case class OrientationChangeEvent(device: String, data: OrientationChangeData)
  case class OrientationChangeData(alpha: Double, beta: Double, gamma: Double)
}

class DataMerger extends Actor {

  var devices = Set.empty[String]
  var consumers = Set.empty[String]
  val (dataEnumerator,dataChannel) = Concurrent.broadcast[JsValue]

  def receive = {
    case RegisterProducer(device) => {
      devices = devices + device
    }
    case RegisterConsumer(device) => {
      consumers = consumers + device
      sender ! RegisterConsumerConfirmation(dataEnumerator)
    }
    case e: OrientationChangeEvent => {
      broadCastMessage(e)
    }
  }

  def broadCastMessage(event: OrientationChangeEvent) = dataChannel.push(Json.toJson(event))
}
