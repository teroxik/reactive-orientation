package actor

import akka.actor.Actor
import play.api.libs.json.{Json, JsValue}
import play.api.libs.iteratee.Concurrent

case class RegisterProducer(username: String)
case class RegisterConsumer(username: String)
case class Data(username: String,data: String)


class DataMerger extends Actor {

  var devices = Set.empty[String]
  var consumers = Set.empty[String]
  val (dataEnumerator,dataChannel) = Concurrent.broadcast[JsValue]


  def receive = {
    case RegisterProducer(username) => {
      devices = devices + username
    }
    case RegisterConsumer(username) => {
      consumers = consumers + username
      sender ! dataEnumerator
    }
    case Data(username, data) => {
      broadCastMessage(username,data)
    }

  }

  def broadCastMessage(user:String, text:String): Unit = {
    val msg = Json.obj()
    dataChannel.push(msg);
  }

}
