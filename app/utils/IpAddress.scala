package utils

import java.net.{InetAddress, NetworkInterface}
import collection.JavaConverters._
import scalaz._
import Scalaz._

object IpAddress {

  def getIpAddreses() = {
    def processAddress(address: InetAddress): String = {
      val bytes: Array[Byte] = address.getAddress
      s"${bytes(0) & 0xFF}.${bytes(1) & 0xFF}.${bytes(2) & 0xFF}.${bytes(3) & 0xFF}"
    }

    Validation.fromTryCatch(
      NetworkInterface.getNetworkInterfaces().asScala
        .flatMap(_.getInetAddresses.asScala)
        .map(processAddress)
        .toList
        .mkString(", ")
    ).<-:(_ => "Ip address could not be retrieved. Please find your ip address manually to continue")
  }


}
